import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import L from 'leaflet'; // Import Leaflet
import PizzaFav from './pizza.png'; // Import the image

import importedVariables from './myVariables.json'; // Import the JSON file directly
import { PontosDeEntrega, selectMarkerColor } from './PontosDeEntrega';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import { filterLoccationsOverLaping, getOffsetPosition, isClose } from './ManageOverlapPoints';
import MapaDelivery from './MapaDelivery';

function App() {

  return (
    <>
      <MapaDelivery />
    </> 
  );
}

export default App;