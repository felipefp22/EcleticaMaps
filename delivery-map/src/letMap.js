import L from 'leaflet'; // Importa o Leaflet

export function initMap() {
  // Inicializa o mapa
  const map = L.map('map').setView([-23.691047472947353, -46.714394001780896], 20); // Define a centralização do mapa

  // Adiciona uma camada de tiles do OpenStreetMap
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }).addTo(map);

  // Adiciona um marcador em Brasília
  const marker = L.marker([-23.691047472947353, -46.714394001780896]).addTo(map);
  marker.bindPopup('<b>Brasília</b><br>Capital do Brasil.').openPopup();

  return map; // Retorna o mapa
}