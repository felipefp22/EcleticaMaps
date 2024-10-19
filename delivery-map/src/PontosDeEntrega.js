// Marker.js
import L from 'leaflet';

export const PontosDeEntrega = ({ map, lat, lng, label }) => {
  const pizzaIcon = L.divIcon({
    html: `
      <div style="
        position: relative; 
        width: 40px; 
        height: 40px; 
        background-color: rgba(0, 0, 255, 0.589);
        text-align: center;
        line-height: 40px;
        font-weight: 800;
        color: white;
        border-radius: 50px;">
        ${label}
      </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: ''
  });

  L.marker([lat, lng], { icon: pizzaIcon })
    .addTo(map)
    .bindPopup(`${label} minutes`)
    .openPopup();
};

export const fetchPontosDeEntrega = async () => {
  return [
    {
      lat: -23.691106873992,
      lng: -46.71366202199305,
      label: '19'
    },
    {
      lat: -23.691047472947353,
      lng: -46.714394001780896,
      label: '19'
    },
    {
      lat: -23.691047472947353,
      lng: -46.714394001780896,
      label: '19'
    },
    {
      lat: -23.691047472947353,
      lng: -46.714394001780896,
      label: '19'
    }
  ];
}