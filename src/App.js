// src/App.js

import React, { useState, useEffect } from 'react';
//import './App.css';
import SearchBar from './components/SearchBar/SearchBar';
import WeatherDisplay from './components/WeatherDisplay/WeatherDisplay';
import Loader from './components/Loader/Loader';
import WeatherChart from './components/WeatherChart/WeatherChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importamos Font Awesome
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'; // Importamos iconos de sol y luna
import './styles/dark-mode.css';
import './styles/glassmorphism.css';
import './styles/variables.css';
import './styles/globals.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [darkMode, setDarkMode] = useState(false); // Estado para modo oscuro

  // Alternar modo oscuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleSearch = (city, countryCode, stateCode = '') => {
    setLoading(true);
    setError(null);
    setWeatherData(null);
    setForecastData([]);

    let query = `${city},${countryCode}`;
    if (stateCode) {
      query += `,${stateCode}`;
    }

    const apiKey = '5d10b5bcf9e181f8a1f81c1051a08d6f';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('City not found or API issue');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Data received from API:', data);
        setWeatherData(data);

        const processedForecast = data.list.slice(0, 7).map((forecast) => ({
          date: new Date(forecast.dt * 1000).toLocaleDateString(),
          maxTemp: forecast.main.temp_max,
          minTemp: forecast.main.temp_min,
        }));
        setForecastData(processedForecast);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
        setError('City not found or there was an issue retrieving data. Please try again.');
      });
  };

  const addToFavorites = (city) => {
    if (!favorites.includes(city)) {
      const updatedFavorites = [...favorites, city];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  const removeFromFavorites = (city) => {
    const updatedFavorites = favorites.filter((fav) => fav !== city);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <div className="container">
      {/* Botón de Modo Oscuro/Día */}
      <button className="dark-mode-toggle" onClick={toggleDarkMode}>
        {darkMode ? (
          <FontAwesomeIcon icon={faSun} className="icon" />
        ) : (
          <FontAwesomeIcon icon={faMoon} className="icon" />
        )}
      </button>

      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1 className="text-center my-4">Weather App</h1>
          <SearchBar onSearch={handleSearch} />

          {loading && <Loader />}
          
          {weatherData && (
            <div className="glass-card">
              <WeatherDisplay data={weatherData} />
              <button
                className="btn btn-primary mt-3"
                onClick={() => addToFavorites(weatherData.city.name)}
              >
                Add to Favorites
              </button>
            </div>
          )}
          
          {error && <p className="text-danger text-center">{error}</p>}
          
          {forecastData.length > 0 && <WeatherChart forecastData={forecastData} />}

          <div className="favorites mt-5">
            <h3>Favorite Cities</h3>
            <ul className="list-group">
              {favorites.map((city, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <span onClick={() => handleSearch(city)} style={{ cursor: 'pointer' }}>
                    {city}
                  </span>
                  <button className="btn btn-danger btn-sm" onClick={() => removeFromFavorites(city)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
