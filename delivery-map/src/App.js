import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import L from 'leaflet'; // Import Leaflet
import PizzaFav from './pizza.png'; // Import the image

import importedVariables from './myVariables.json'; // Import the JSON file directly
import { fetchPontosDeEntrega, fetchPontosDeEntregaTeste, PontosDeEntrega } from './PontosDeEntrega';

function App() {

  const [myVariables, setMyVariables] = useState(importedVariables)
  const mapRef = useRef(null); // Referência para o mapa
  const [locations, setLocations] = useState([]); // State to hold locations
  const [zoom, setZoom] = useState(myVariables.zoom); // State to hold the zoom level

  useEffect(() => {
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

    // fetchPontosDeEntrega()
    fetchData()
      .then(data => {
        setLocations(data); // Update state with fetched data
      })
      .catch(error => console.error('Error fetching locations:', error));

    return () => {
      mapRef.current.remove(); // Remove o mapa ao desmontar para evitar leaks de memória
    };
  }, [myVariables]);

  useEffect(() => {
    // Add markers for each location
    locations.forEach(location => {
      PontosDeEntrega({
        map: mapRef.current,
        lat: location.lat,
        lng: location.lng,
        label: location.id,
        minutes: location.minutes // Replace with your desired label
      });
    });
  }, [locations]);

  const centralizarMapa = () => {
    // Centraliza o mapa na posição especificada
    if (mapRef.current) {
      mapRef.current.setView([myVariables.mainLocationLatitude, myVariables.mainLocationLongitude], zoom);
    }
  };

  const handleZoomChange = (e) => {
    setZoom(Number(e.target.value)); // Update the zoom value
    const updatedVariables = {
      ...myVariables,
      zoom: Number(e.target.value), // Update the zoom value
    };
    setMyVariables(updatedVariables); // Update state

    // Save to local storage as a demonstration (to persist the updated values)
    localStorage.setItem('myVariables', JSON.stringify(updatedVariables));
  };

  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const results = await window.electronAPI.queryDatabase('SELECT * FROM pedidos');

      return results;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="App">

      <div className='barraSuperior1'>
        <input type='text' placeholder='Endereço para centralizar Mapa' /> {/* Corrected here */}
        <button className='btn-light'>Salvar-Local</button>
        <button onClick={fetchData} className='btn-light'>ATUALIZAR</button>
        <select className='selectZoom' onChange={handleZoomChange}>
          <option value="14">1 - Zoom</option>
          <option value="15">2 - Zoom</option>
          <option value="16">3 - Zoom</option>
          <option value="17">4 - Zoom</option>
          <option value="18">5 - Zoom</option>
        </select>
        <button className='btn-light' onClick={centralizarMapa}>Centralizar Mapa</button> {/* Botão para centralizar o mapa */}

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


      <div className='mapa' id='mapa' style={{ height: '87vh', width: '99vw' }}></div> {/* Div for the map */}

    </div>
  );
}

export default App;