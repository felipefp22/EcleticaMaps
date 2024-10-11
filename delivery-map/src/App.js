import React, { useEffect,  useRef } from 'react';
import './App.css';
import L from 'leaflet'; // Import Leaflet


function App() {

  const mapRef = useRef(null); // Referência para o mapa

  useEffect(() => {
    // Inicializa o mapa
    mapRef.current = L.map('mapa').setView([-23.691047472947353, -46.714394001780896], 15); // Define a centralização do mapa

    // Adiciona uma camada de tiles do OpenStreetMap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(mapRef.current);

    L.marker([-23.691047472947353, -46.714394001780896]).addTo(mapRef.current)
    .bindPopup('Local inicial.')
    .openPopup();

    return () => {
      mapRef.current.remove(); // Remove o mapa ao desmontar para evitar leaks de memória
    };
  }, []);

  const centralizarMapa = () => {
    // Centraliza o mapa na posição especificada
    if (mapRef.current) {
      mapRef.current.setView([-23.691047472947353, -46.714394001780896], 15);
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