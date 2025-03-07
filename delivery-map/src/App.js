import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import L from 'leaflet'; // Import Leaflet
import PizzaFav from './pizza.png'; // Import the image

import importedVariables from './myVariables.json'; // Import the JSON file directly
import { PontosDeEntrega } from './PontosDeEntrega';

function App() {
  const [settings, setSettings] = useState({});

  const [myVariables, setMyVariables] = useState(null)
  const mapRef = useRef(null); // Referência para o mapa
  const [locations, setLocations] = useState([]); // State to hold locations
  const [zoom, setZoom] = useState(null); // State to hold the zoom level
  const markersRef = useRef(null); // Reference to manage markers


  useEffect(() => {

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

  useEffect(() => {
    // Load settings when the component mounts
    window.electronAPI.loadSettings().then((loadedSettings) => {
      setSettings(loadedSettings);
      setMyVariables(loadedSettings);
      setZoom(loadedSettings.zoom);
    });
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
    }, 20000); // 20 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  function updateMarkersPontosDeEntrega() {
    if (myVariables && zoom && myVariables.mainLocationLatitude && myVariables.mainLocationLongitude && markersRef.current) {

      if (markersRef.current) {
        markersRef.current.clearLayers(); // Clear existing markers
      }

      locations.forEach(location => {
        if(!location.entregador){
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
      const results = window.electronAPI.queryDatabase('SELECT * FROM pagamentos_pendentes');

      results.then((data) => {
        setLocations(data);
        console.log(data)
      });

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
        onChange={(e) => {const value = e.target.value.replace(',', '.'); if (/^-?\d*\.?\d*$/.test(value)) {setNewLatRestaurant(value);}}} placeholder="Latitude"/>

        <input style={{ maxWidth: "170px" }} value={newLngRestaurant || ""} type="text" 
        onChange={(e) => {const value = e.target.value.replace(',', '.'); if (/^-?\d*\.?\d*$/.test(value)) {setNewLngRestaurant(value);}}} placeholder="Longitude"/>

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
        <button style={{ width: '35px', height: '35px', backgroundColor: '#fffb0b' }}></button> <h4 style={{ color: 'black' }}> 1a5 min </h4>
        <button style={{ width: '35px', height: '35px', backgroundColor: '#a1ff0b' }}></button> <h4 style={{ color: 'black' }}> 6a10 min </h4>

        <button style={{ width: '35px', height: '35px', backgroundColor: '#0c97e7' }}></button> <h4 style={{ color: 'black' }}> 11a20 min </h4>

        <button style={{ width: '35px', height: '35px', backgroundColor: '#5715f1' }}></button> <h4 style={{ color: 'black' }}> 21a30 min </h4>

        <button style={{ width: '35px', height: '35px', backgroundColor: '#eb2778' }}></button> <h4 style={{ color: 'black' }}> 31a40 min </h4>

        <button style={{ width: '35px', height: '35px', backgroundColor: '#ec5b06' }}></button> <h4 style={{ color: 'black' }}> 41a50 min </h4>

        <button style={{ width: '35px', height: '35px', backgroundColor: '#e40e0e' }}></button> <h4 style={{ color: 'black' }}> 51a60 min </h4>

        <button style={{ width: '35px', height: '35px', backgroundColor: '#e40e0e', border: '4px solid #f36818' }}></button> <h4 style={{ color: 'black' }}> 61a70 min </h4>
        <button style={{ width: '35px', height: '35px', backgroundColor: '#e40e0e', border: '10px solid #f36818' }}></button> <h4 style={{ color: 'black' }}> 70+ min </h4>

      </div>


      {myVariables && <div className='mapa' id='mapa' style={{ height: '87vh', width: '99vw' }}></div>} {/* Div for the map */}

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