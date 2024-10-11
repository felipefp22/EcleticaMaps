import React, { useEffect } from 'react';
import './App.css';
import L from 'leaflet'; // Import Leaflet


function App() {
  useEffect(() => {
    // Initialize the map in the 'mapa' div
    const map = L.map('mapa').setView([-23.691047472947353, -46.714394001780896], 15); // Set the center and zoom level

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add ponto central, local do comercio to the map
    L.marker([-23.691047472947353, -46.714394001780896]).addTo(map)
      .bindPopup('Local inicial.')
      .openPopup();

    // Cleanup map on component unmount
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="App">

      <div className='barraSuperior'>
        <input type='text' placeholder='Endereço para centralizar Mapa' /> {/* Corrected here */}
        <button className='salvarLocalButton'>Salvar-Local</button>
        <button className='atualizarButton'>ATUALIZAR</button>
      </div>

      <div className='mapa' id='mapa' style={{ height: '800px', width: '100%' }}></div> {/* Div for the map */}


      <div className='barraPedidos'>
      </div>
    </div>
  );
}

export default App;