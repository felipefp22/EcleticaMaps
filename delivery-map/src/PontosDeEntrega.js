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
        font-size: 21px;
        border-radius: 50px;
                -webkit-text-stroke: 1.5px black;  /* Border around the text */
        // text-shadow: 1px 1px 0 black;    /* Shadow to create a border effect */
        ">
        ${label}
      </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
        className: ''
    });

    L.marker([lat, lng], { icon: pizzaIcon })
        .addTo(map)
        .bindPopup(`${minutes}min`)
        .openPopup();
};

function selectMarkerColor(minutes) {
    if (minutes <= 5) {
        return '#fffb0b';


    } else if (minutes > 5 && minutes <= 10) {
        return '#a1ff0b';


    } else if (minutes > 10 && minutes <= 15) {
        return '#0c97e7';
    } else if (minutes > 15 && minutes <= 20) {
        // return '#0c6be7';
        return '#0c97e7';


    } else if (minutes > 20 && minutes <= 25) {
        return '#5715f1';
        // return '#0e1dfc';
    } else if (minutes > 25 && minutes <= 30) {
        return '#5715f1';


    } else if (minutes > 30 && minutes <= 35) {
        return '#eb2778';
    } else if (minutes > 35 && minutes <= 40) {
        // return '#b6118d';
        return '#eb2778';


    } else if (minutes > 40 && minutes <= 45) {
        return '#ec5b06';
    } else if (minutes > 45 && minutes <= 50) {
        // return '#e42e0e';
        return '#ec5b06';



    } else if (minutes > 50 && minutes <= 55) {
        return '#e40e0e';
    } else if (minutes > 55 && minutes <= 60) {
        return '#e40e0e';



    } else if (minutes > 60 && minutes <= 65) {
        return '#e40e0e; border: 4px solid #f36818'
    } else if (minutes > 65 && minutes <= 70) {
        return '#e40e0e; border: 4px solid #f36818'


    } else if (minutes > 70) {
        return '#e40e0e; border: 10px solid #f36818'
    }
}

// export const fetchPontosDeEntregaTeste = async () => {
//     return [
//         {
//             lat: -23.689106873992,
//             lng: -46.710394001780896,
//             label: '1',
//             minutes: 71
//         },
//         {
//             lat: -23.695047472947353,
//             lng: -46.708394001780896,
//             label: '2',
//             minutes: 61
//         },
//         {
//             lat: -23.689047472947353,
//             lng: -46.704394001780896,
//             label: '3',
//             minutes: 56
//         },
//         {
//             lat: -23.691047472947353,
//             lng: -46.705394001780896,
//             label: '4',
//             minutes: 51
//         },
//         {
//             lat: -23.695106873992,
//             lng: -46.71266202199305,
//             label: '5',
//             minutes: 46
//         },
//         {
//             lat: -23.691047472947353,
//             lng: -46.708394001780896,
//             label: '6',
//             minutes: 41
//         },
//         {
//             lat: -23.687047472947353,
//             lng: -46.702394001780896,
//             label: '7',
//             minutes: 36
//         },
//         {
//             lat: -23.695047472947353,
//             lng: -46.710394001780896,
//             label: '8',
//             minutes: 31
//         },        {
//             lat: -23.696106873992,
//             lng: -46.71166202199305,
//             label: '9',
//             minutes: 26
//         },
//         {
//             lat: -23.694047472947353,
//             lng: -46.712394001780896,
//             label: '10',
//             minutes: 21
//         },
//         {
//             lat: -23.69395047472947353,
//             lng: -46.709394001780896,
//             label: '11',
//             minutes: 16
//         },
//         {
//             lat: -23.691047472947353,
//             lng: -46.711394001780896,
//             label: '12',
//             minutes: 11
//         },        {
//             lat: -23.689106873992,
//             lng: -46.70866202199305,
//             label: '13',
//             minutes: 6
//         },
//         {
//             lat: -23.692047472947353,
//             lng: -46.710394001780896,
//             label: '14',
//             minutes: 1
//         }
//     ];
// }
