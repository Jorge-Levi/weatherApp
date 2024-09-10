// src/WeatherChart.js

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './WeatherChart.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeatherChart = ({ forecastData }) => {
  const data = {
    labels: forecastData.map((item) => item.date), // Fechas del pronóstico
    datasets: [
      {
        label: 'Max Temp (°C)',
        data: forecastData.map((item) => item.maxTemp),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
      {
        label: 'Min Temp (°C)',
        data: forecastData.map((item) => item.minTemp),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true, // Hace que la gráfica sea fluida y se ajuste al tamaño de la pantalla
    maintainAspectRatio: false, // Permite ajustar la gráfica al contenedor sin mantener una relación de aspecto fija
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 7, // Limita la cantidad de etiquetas visibles en el eje x
        },
      },
      y: {
        beginAtZero: true, // Comienza desde cero en el eje Y
        ticks: {
          stepSize: 5, // Define que las unidades del eje Y se muestren de 1 en 1
        },
      },
    },
    plugins: {
      legend: {
        position: 'top', // Posición de la leyenda
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default WeatherChart;
