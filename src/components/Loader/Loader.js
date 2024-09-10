// src/Loader.js

import React from 'react';
import './Loader.css'; // Enlazamos los estilos de CSS

function Loader() {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Fetching the latest weather data...</p>
    </div>
  );
}

export default Loader;
