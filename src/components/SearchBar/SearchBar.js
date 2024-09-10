// src/SearchBar.js

import React, { useState, useEffect } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';

// Función debounce para limitar las solicitudes a la API
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

function SearchBar({ onSearch }) {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const [stateSuggestions, setStateSuggestions] = useState([]);

  const handleSearch = () => {
    const cityName = city.trim();
    const countryCode = country.trim().toUpperCase();
    const stateCode = state.trim().toUpperCase();

    if (!cityName || !countryCode) {
      alert('Please enter a city name and country code.');
      return;
    }

    // Llamar a la función de búsqueda
    onSearch(cityName, countryCode, stateCode);
  };

  // Autocompletar para el nombre del país usando la API de GeoDB
  const fetchCountries = async (country) => {
    try {
      const response = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/countries?namePrefix=${country}&limit=5`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': '39c247a4c5msh56f85576bb78a48p1c3b47jsnf76acac04ac0',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
          },
        }
      );
      const data = await response.json();
      setCountrySuggestions(data.data.map((country) => ({
        code: country.code,
        name: country.name,
      })));
    } catch (error) {
      console.error('Error fetching country suggestions:', error);
    }
  };

  const debouncedFetchCountries = debounce(fetchCountries, 500); // 500ms debounce

  useEffect(() => {
    if (country.length > 1) {
      debouncedFetchCountries(country);
    } else {
      setCountrySuggestions([]);
    }
  }, [country]);

  const fetchStates = async (country, state) => {
    try {
      const response = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${country}/regions?namePrefix=${state}&limit=5`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': '39c247a4c5msh56f85576bb78a48p1c3b47jsnf76acac04ac0',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
          },
        }
      );
      const data = await response.json();
      setStateSuggestions(data.data.map((region) => ({
        code: region.code,
        name: region.name,
      })));
    } catch (error) {
      console.error('Error fetching state suggestions:', error);
    }
  };

  const debouncedFetchStates = debounce(fetchStates, 500);

  useEffect(() => {
    if (country && country.length === 2 && state.length > 1) {
      debouncedFetchStates(country, state);
    } else {
      setStateSuggestions([]);
    }
  }, [country, state]);

  return (
    <div>
      <Form className="my-4">
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter country name"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          {countrySuggestions.length > 0 && (
            <ListGroup>
              {countrySuggestions.map((suggestion, index) => (
                <ListGroup.Item
                  key={index}
                  action
                  onClick={() => {
                    setCountry(suggestion.code);
                    setCountrySuggestions([]); // Limpiar sugerencias
                  }}
                >
                  {suggestion.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Form.Group>

        {country && (
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Enter state code (optional)"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            {stateSuggestions.length > 0 && (
              <ListGroup>
                {stateSuggestions.map((suggestion, index) => (
                  <ListGroup.Item
                    key={index}
                    action
                    onClick={() => {
                      setState(suggestion.code);
                      setStateSuggestions([]); // Limpiar sugerencias
                    }}
                  >
                    {suggestion.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Form.Group>
        )}

        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
      </Form>
    </div>
  );
}

export default SearchBar;
