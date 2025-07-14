import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import L from 'leaflet'; // Import Leaflet
import PizzaFav from './pizza.png'; // Import the image

import importedVariables from './myVariables.json'; // Import the JSON file directly
import { PontosDeEntrega, selectMarkerColor } from './PontosDeEntrega';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import { filterLoccationsOverLaping, getOffsetPosition, isClose } from './ManageOverlapPoints';

function App() {
  const [settings, setSettings] = useState({});

  const [myVariables, setMyVariables] = useState(null)
  const mapRef = useRef(null); // Referência para o mapa
  const [locations, setLocations] = useState([]); // State to hold locations
  const [zoom, setZoom] = useState(null); // State to hold the zoom level
  const markersRef = useRef(null); // Reference to manage markers


  // Load settings when the component mounts / can be with clustr or without cluste <>----<>
  useEffect(() => {
    // SEM CLUSTER--------

    if (myVariables && zoom && myVariables.mainLocationLatitude && myVariables.mainLocationLongitude) {
      console.log('myVariables:', myVariables);
      // Inicializa o mapa
      mapRef.current = L.map('mapa').setView([myVariables.mainLocationLatitude, myVariables.mainLocationLongitude], zoom); // Define a centralização do mapa

      // Adiciona uma camada de tiles do OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);

      // Adicionando marcador principal
      const pizzaIcon = L.icon({
        iconUrl: PizzaFav,
        iconSize: [70, 70],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });
      L.marker([myVariables.mainLocationLatitude, myVariables.mainLocationLongitude], { icon: pizzaIcon })
        .addTo(mapRef.current)
        .bindPopup('RESTAURANTE')
        .openPopup();
      //------------------------------
      // Marcadores lugares de entrega

      markersRef.current = L.layerGroup().addTo(mapRef.current);

      fetchDataToLocation();
      console.log("zoom  " + zoom)

      //------------------------------
      return () => {
        mapRef.current.remove(); // Remove o mapa ao desmontar para evitar leaks de memória
      };
    }
  }, [myVariables, zoom]);

  // useEffect(() => {
  //   // COM CLUSTER--------

  //   if (myVariables && zoom && myVariables.mainLocationLatitude && myVariables.mainLocationLongitude) {
  //     console.log('myVariables:', myVariables);

  //     // Inicializa o mapa
  //     mapRef.current = L.map('mapa').setView(
  //       [myVariables.mainLocationLatitude, myVariables.mainLocationLongitude],
  //       zoom
  //     );

  //     // Adiciona camada OSM
  //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //       maxZoom: 19,
  //       attribution: '&copy; OpenStreetMap contributors',
  //     }).addTo(mapRef.current);

  //     // Ícone principal (restaurante)
  //     const pizzaIcon = L.icon({
  //       iconUrl: PizzaFav,
  //       iconSize: [70, 70],
  //       iconAnchor: [20, 40],
  //       popupAnchor: [0, -40],
  //     });

  //     L.marker(
  //       [myVariables.mainLocationLatitude, myVariables.mainLocationLongitude],
  //       { icon: pizzaIcon }
  //     )
  //       .addTo(mapRef.current)
  //       .bindPopup('RESTAURANTE')
  //       .openPopup();

  //     // ✅ INICIALIZA MARKER CLUSTER
  //     markersRef.current = L.markerClusterGroup({
  //       iconCreateFunction: (cluster) => {
  //         const count = cluster.getChildCount();
  //         return L.divIcon({
  //           html: `<div style="
  //             background: rgba(148, 56, 235, 07); 
  //             color: white; 
  //             font-weight: bold;
  //             font-size: 21px; 
  //             width: 40px; 
  //             height: 40px; 
  //             display: flex; 
  //             align-items: center; 
  //             justify-content: center;
  //             border: 3px solid white;
  //             box-shadow: 0 0 4px rgba(0,0,0,0.5);
  //           ">[${count}]</div>`,
  //           className: '',
  //           iconSize: [40, 40],
  //         });
  //       },
  //     });

  //     markersRef.current.addTo(mapRef.current); // ⬅️ Adiciona cluster ao mapa

  //     // Carrega dados
  //     fetchDataToLocation();
  //     console.log('zoom  ' + zoom);

  //     // Cleanup
  //     return () => {
  //       mapRef.current.remove();
  //     };
  //   }
  // }, [myVariables, zoom]);
  // Load settings when the component mounts / can be with clustr or without cluste <>----<>


  useEffect(() => {
    // Load settings when the component mounts
    if (window.electronAPI?.loadSettings) {
      window.electronAPI.loadSettings().then((loadedSettings) => {
        setSettings(loadedSettings);
        setMyVariables(loadedSettings);
        setZoom(loadedSettings.zoom);
      });
    } else {
      setSettings(importedVariables);
      setMyVariables(importedVariables);
      setZoom(importedVariables.zoom);
    }
  }, []);
  useEffect(() => {
    console.log('Updated settings:', settings);
    console.log('Updated myVariables:', myVariables);
    console.log('Updated zoom:', zoom);
  }, [settings, myVariables, zoom]);

  useEffect(() => {
    updateMarkersPontosDeEntrega();
  }, [locations]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDataToLocation();
    }, 5000); // 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  function updateMarkersPontosDeEntrega() {
    if (myVariables && zoom && myVariables.mainLocationLatitude && myVariables.mainLocationLongitude && markersRef.current) {

      if (markersRef.current) {
        markersRef.current.clearLayers(); // Clear existing markers
      }

      const filteredLocations = filterLoccationsOverLaping(locations);
      filteredLocations.forEach(location => {
        if (!location.entregador && location.flag_dely != "V") {
          PontosDeEntrega({
            map: mapRef.current,
            markersGroup: markersRef.current,
            lat: location.latitude,
            lng: location.longitude,
            label: location.numero_ped_dely,
            minutes: Math.round((new Date() - location.data_hora_abre) / 60000)
          });
        }
      });

    }
  };

  const centralizarMapa = () => {
    // Centraliza o mapa na posição especificada
    if (mapRef.current) {
      mapRef.current.setView([myVariables.mainLocationLatitude, myVariables.mainLocationLongitude], zoom);
    }
  };

  const handleZoomChange = (e) => {
    setZoom(Number(e.target.value)); // Update the zoom value

    const updatedSettings = {
      ...settings,
      zoom: Number(e.target.value),
    };

    window.electronAPI.saveSettings(updatedSettings).then((response) => {
      setSettings(updatedSettings); // Update state with the new settings
    });

    // Save to local storage as a demonstration (to persist the updated values)
    // localStorage.setItem('myVariables', JSON.stringify(updatedVariables));
  };

  function fetchDataToLocation() {
    try {
      if (window.electronAPI) {
        const results = window.electronAPI.queryDatabase('SELECT * FROM pagamentos_pendentes');

        results.then((data) => {
          setLocations(data);
        });
      } else {
        setLocations(
          [{ latitude: -23.652398, longitude: -46.708661, numero_ped_dely: '8', data_hora_abre: new Date("2025-07-12T20:45:00Z") },
          { latitude: -23.652398, longitude: -46.7086, numero_ped_dely: '10', data_hora_abre: new Date("2025-07-12T20:45:00Z") },
          { latitude: -23.652398, longitude: -46.7086, numero_ped_dely: '10', data_hora_abre: new Date("2025-07-12T20:45:00Z") },
          { latitude: -23.652398, longitude: -46.7086, numero_ped_dely: '11', data_hora_abre: new Date("2025-07-12T20:45:00Z") },
          { latitude: -23.652398, longitude: -46.7086, numero_ped_dely: '12', data_hora_abre: new Date("2025-07-12T20:45:00Z") },
          { latitude: -23.652, longitude: -46.7089, numero_ped_dely: '52', data_hora_abre: new Date("2025-07-12T20:45:00Z") }])
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [newLatRestaurant, setNewLatRestaurant] = useState(null);
  const [newLngRestaurant, setNewLngRestaurant] = useState(null);

  function saveNewRestaurantLocation() {
    // Save the new restaurant location
    if (newLatRestaurant && newLngRestaurant) {

      const updatedSettings = {
        ...settings,
        mainLocationLatitude: newLatRestaurant,
        mainLocationLongitude: newLngRestaurant,
      };

      // Save the updated settings
      window.electronAPI.saveSettings(updatedSettings).then((response) => {
        setSettings(updatedSettings); // Update state with the new settings
      });

      setNewLatRestaurant(null);
      setNewLngRestaurant(null);
      window.location.reload();
    }

  }

  const [isModalVisible, setModalVisible] = useState(false); // State to control the modal visibility
  const handleOpenModal = () => {
    const latPattern = /^-?(90(\.0{1,8})?|[0-8]?\d(\.\d{1,8})?)$/;

    const lngPattern = /^-?(180(\.0{1,8})?|1[0-7]\d(\.\d{1,8})?|[0-9]?\d(\.\d{1,8})?)$/;

    if (
      newLatRestaurant &&
      latPattern.test(newLatRestaurant) &&
      newLngRestaurant &&
      lngPattern.test(newLngRestaurant)
    ) {
      setModalVisible(true);
    }
  };

  return (
    <div className="App">

      <div className='barraSuperior1'>
        <button className='btn-light' onClick={handleOpenModal}>Salvar-Local</button>

        <input style={{ maxWidth: "170px" }} value={newLatRestaurant || ""} type="text"
          onChange={(e) => { const value = e.target.value.replace(',', '.'); if (/^-?\d*\.?\d*$/.test(value)) { setNewLatRestaurant(value); } }} placeholder="Latitude" />

        <input style={{ maxWidth: "170px" }} value={newLngRestaurant || ""} type="text"
          onChange={(e) => { const value = e.target.value.replace(',', '.'); if (/^-?\d*\.?\d*$/.test(value)) { setNewLngRestaurant(value); } }} placeholder="Longitude" />

        <h4>|</h4>
        <h4></h4>
        <h4></h4>
        <h4></h4>
        <h4></h4>
        <h4></h4>
        <h4></h4>
        <h4></h4>

        <select className='selectZoom' value={zoom} onChange={handleZoomChange}>
          <option value="14">1 - Zoom</option>
          <option value="15">2 - Zoom</option>
          <option value="16">3 - Zoom</option>
          <option value="17">4 - Zoom</option>
          <option value="18">5 - Zoom</option>
        </select>

        <button className='btn-light' onClick={centralizarMapa}>Centralizar Mapa</button> {/* Botão para centralizar o mapa */}

        <button onClick={fetchDataToLocation} className='btn-light'>ATUALIZAR</button>
      </div>

      <div className='barraSuperior2'>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          <div style={{ width: '35px', height: '35px', backgroundColor: selectMarkerColor(3), borderRadius: '50%', marginLeft: 10, marginRight: 2 }}></div> <h4 style={{ color: 'black' }}> 1-5 min </h4>

          <div style={{ width: '35px', height: '35px', backgroundColor: selectMarkerColor(8), borderRadius: '50%', marginLeft: 10, marginRight: 2 }}></div> <h4 style={{ color: 'black' }}> 6-10 min </h4>

          <div style={{ width: '35px', height: '35px', backgroundColor: selectMarkerColor(15), borderRadius: '50%', marginLeft: 10, marginRight: 2 }}></div> <h4 style={{ color: 'black' }}> 11-20 min </h4>

          <div style={{ width: '35px', height: '35px', backgroundColor: selectMarkerColor(25), borderRadius: '50%', marginLeft: 10, marginRight: 2 }}></div> <h4 style={{ color: 'black' }}> 21-30 min </h4>

          <div style={{ width: '35px', height: '35px', backgroundColor: selectMarkerColor(35), borderRadius: '50%', marginLeft: 10, marginRight: 2 }}></div> <h4 style={{ color: 'black' }}> 31-40 min </h4>

          <div style={{ width: '35px', height: '35px', backgroundColor: selectMarkerColor(45), borderRadius: '50%', marginLeft: 10, marginRight: 2 }}></div> <h4 style={{ color: 'black' }}> 41-50 min </h4>

          <div style={{ width: '35px', height: '35px', backgroundColor: selectMarkerColor(55), borderRadius: '50%', marginLeft: 10, marginRight: 2 }}></div> <h4 style={{ color: 'black' }}> 51-60 min </h4>


          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '35px', height: '35px', backgroundColor: selectMarkerColor(68), borderRadius: '50%', marginLeft: 10, marginRight: 2, alignContent: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesomeIcon icon={faFireFlameCurved} style={{ color: '#FFD43B', fontSize: '18=5px', position: 'absolute', bottom: 25 }} />
          </div> <h4 style={{ color: 'black' }}> 61-70 min </h4>


          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '35px', height: '35px', backgroundColor: "#e40e0e", borderRadius: '50%', marginLeft: 10, marginRight: 2, border: '4px solid #f36818', }}>
            <FontAwesomeIcon icon={faFireFlameCurved} style={{ color: '#FFD43B', fontSize: '30px', position: 'absolute', bottom: 20, textShadow: '0px 2px 100px rgba(0,0,0,0.4)' }} />
          </div> <h4 style={{ color: 'black' }}> 70+ min </h4>

        </div>
      </div>


      {myVariables && <div className='mapa' id='mapa' style={{ height: '87vh', width: '100vw' }}></div>} {/* Div for the map */}

      {isModalVisible && (
        <div className="popup-modal">
          <div className="popup-content">
            <h3>Tem certeza em salvar? Isto pode desconfigurar o MAPA</h3>
            <h4>Latitude: {newLatRestaurant}</h4>
            <h4>Longitude: {newLngRestaurant}</h4>
            <div className="popup-actions">
              <button className="btn-confirm" onClick={saveNewRestaurantLocation}>OK</button>
              <button className="btn-cancel" onClick={() => { setModalVisible(false); setNewLatRestaurant(null); setNewLngRestaurant(null); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}

export default App;