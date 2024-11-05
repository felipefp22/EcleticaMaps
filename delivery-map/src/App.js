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
    fetchPontosDeEntregaTeste()
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
        label: location.label,
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


  return (
    <div className="App">

      <div className='barraSuperior1'>
        <input type='text' placeholder='Endereço para centralizar Mapa' /> {/* Corrected here */}
        <button className='salvarLocalButton'>Salvar-Local</button>
        <button className='atualizarButton'>ATUALIZAR</button>
        <select className='selectZoom' onChange={handleZoomChange}>
          <option value="14">1 - Zoom</option>
          <option value="15">2 - Zoom</option>
          <option value="16">3 - Zoom</option>
          <option value="17">4 - Zoom</option>
          <option value="18">5 - Zoom</option>
        </select>
        <button onClick={centralizarMapa}>Centralizar Mapa</button> {/* Botão para centralizar o mapa */}

      </div>

      <div className='barraSuperior2'>
      <button style={{ width: '35px', height: '35px', backgroundColor: '#fffb0b' }}></button> <h1 style={{ color: 'black' }}>1a5 min </h1>
      </div>


      <div className='mapa' id='mapa' style={{ height: '90vh', width: '100vw' }}></div> {/* Div for the map */}

    </div>
  );
}

export default App;