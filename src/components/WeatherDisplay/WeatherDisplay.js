// src/WeatherDisplay.js

import React from 'react';

function WeatherDisplay({ data }) {
  console.log('WeatherDisplay data:', data); // Debug

  if (!data || !data.city || !data.list) {
    return <p>Loading weather data...</p>;
  }

  const cityName = data.city.name;
  const countryName = data.city.country;
  const currentWeather = data.list[0];

  return (
    <div className="weather-update">
      <h2>{cityName}, {countryName}</h2>
      <p>Temperature: {currentWeather.main.temp}°C</p>
      <p>Weather: {currentWeather.weather[0].description}</p>
      <p>Humidity: {currentWeather.main.humidity}%</p>
      <p>Wind Speed: {currentWeather.wind.speed} m/s</p>
    </div>
  );
}

export default WeatherDisplay;
