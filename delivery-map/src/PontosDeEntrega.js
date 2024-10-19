// Marker.js
import L from 'leaflet';

export const PontosDeEntrega = ({ map, lat, lng, label, minutes }) => {
    const markerColor = selectMarkerColor(minutes);

    const pizzaIcon = L.divIcon({
        html: `
      <div style="
        position: relative; 
        width: 40px; 
        height: 40px; 
        background-color: ${markerColor};
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

function selectMarkerColor(minutes) {
    if (minutes <= 5) {
        return '#a19709';
    } else if (minutes > 5 && minutes <= 10) {
        return '#0279e9';
    } else if (minutes > 10 && minutes <= 15) {
        return '#a19709';
    } else if (minutes > 15 && minutes <= 20) {
        return '#0279e9';
    } else if (minutes > 20 && minutes <= 25) {
        return '#a19709';
    } else if (minutes > 25 && minutes <= 30) {
        return '#a19709';
    } else if (minutes > 30 && minutes <= 35) {
        return '#a19709';
    } else if (minutes > 35 && minutes <= 40) {
        return '#0279e9';
    } else if (minutes > 40 && minutes <= 45) {
        return '#0279e9';
    } else if (minutes > 45 && minutes <= 50) {
        return '##a19709';
    } else if (minutes > 50 && minutes <= 55) {
        return '#0279e9';
    } else if (minutes > 55 && minutes <= 60) {
        return '#a19709';
    } else if (minutes > 60 && minutes <= 65) {
        return '#a19709';
    } else if (minutes > 65 && minutes <= 70) {
        return '#a19709';
    }
}

export const fetchPontosDeEntrega = async () => {
    return [
        {
            lat: -23.691106873992,
            lng: -46.71366202199305,
            label: '1',
            minutes: 1
        },
        {
            lat: -23.694047472947353,
            lng: -46.718394001780896,
            label: '2',
            minutes: 6
        },
        {
            lat: -23.689047472947353,
            lng: -46.714394001780896,
            label: '3',
            minutes: 11
        },
        {
            lat: -23.691047472947353,
            lng: -46.710394001780896,
            label: '4',
            minutes: 15
        }
    ];
}



export const fetchPontosDeEntregaTeste = async () => {
    return [
        {
            lat: -23.691106873992,
            lng: -46.71366202199305,
            label: '1',
            minutes: 8
        },
        {
            lat: -23.694047472947353,
            lng: -46.718394001780896,
            label: '2',
            minutes: 11
        },
        {
            lat: -23.689047472947353,
            lng: -46.714394001780896,
            label: '3',
            minutes: 25
        },
        {
            lat: -23.691047472947353,
            lng: -46.710394001780896,
            label: '4',
            minutes: 20
        }
    ];
}