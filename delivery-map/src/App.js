import React, { useEffect,  useRef, useState } from 'react';
import './App.css';
import L from 'leaflet'; // Import Leaflet
import PizzaFav from './pizza.png'; // Import the image

import importedVariables  from './myVariables.json'; // Import the JSON file directly
import { fetchPontosDeEntrega, PontosDeEntrega } from './PontosDeEntrega';

function App() {

  const [myVariables, setMyVariables] = useState(importedVariables)
  const mapRef = useRef(null); // Referência para o mapa
  const [locations, setLocations] = useState([]); // State to hold locations

  useEffect(() => {
    // Inicializa o mapa
    mapRef.current = L.map('mapa').setView([myVariables.mainLocationLatitude, myVariables.mainLocationLongitude], 15); // Define a centralização do mapa

    // Adiciona uma camada de tiles do OpenStreetMap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
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
    .bindPopup('19 min')
    .openPopup();
    //------------------------------

    fetch(fetchPontosDeEntrega)
    .then(response => response.json())
    .then(data => {
      setLocations(data); // Assuming data is an array of { lat, lng, label }
    });

    

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
        label: location.label, // Replace with your desired label
      });
    });
  }, [locations]);

  const centralizarMapa = () => {
    // Centraliza o mapa na posição especificada
    if (mapRef.current) {
      mapRef.current.setView([myVariables.mainLocationLatitude, myVariables.mainLocationLongitude], 15);
    }
  };


  return (
    <div className="App">

      <div className='barraSuperior'>
        <input type='text' placeholder='Endereço para centralizar Mapa' /> {/* Corrected here */}
        <button className='salvarLocalButton'>Salvar-Local</button>
        <button className='atualizarButton'>ATUALIZAR</button>
        <button onClick={centralizarMapa}>Centralizar Mapa</button> {/* Botão para centralizar o mapa */}

      </div>

      <div className='mapa' id='mapa' style={{ height: '800px', width: '100%' }}></div> {/* Div for the map */}


      <div className='barraPedidos'>
      </div>
    </div>
  );
}

export default App;

// L.marker([myVariables.mainLocationLatitude, myVariables.mainLocationLongitude]).addTo(mapRef.current)
// .bindPopup('19 min')
// .openPopup()
// .setIcon(L.divIcon({
//   html: `
//     <div style="
//       position: relative; 
//       width: 40px; 
//       height: 40px; 
//       background-color: rgba(0, 0, 255, 0.589);
//       background-size: cover;
//       text-align: center;
//       line-height: 40px;
//       font-weight: 800;
//       color: white;
//       border-radius: 50px;

//     ">
//       1
//     </div>`, // Aqui você pode substituir "1" pelo número que deseja exibir
//   iconSize: [40, 40],
//   iconAnchor: [20, 40],
//   popupAnchor: [0, -40],
//   className: '' // Remove a classe padrão
// }));