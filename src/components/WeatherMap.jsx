import { useState } from 'react';
import { useWeather } from '../context/WeatherContext';

const WeatherMap = () => {
  const { currentWeather } = useWeather();
  const [mapType, setMapType] = useState('temp_new');

  if (!currentWeather) {
    return (
      <div className="weather-card">
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: 'var(--color-gray-dark)',
          marginBottom: '1rem'
        }} className="dark-text">Weather Map</h2>
        <p>Weather map data is currently unavailable.</p>
      </div>
    );
  }

  // Check if coordinates are available
  if (!currentWeather.coord) {
    return (
      <div className="weather-card">
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: 'var(--color-gray-dark)',
          marginBottom: '1rem'
        }} className="dark-text">Weather Map</h2>
        <p>Location coordinates are not available for the map.</p>
      </div>
    );
  }

  const { coord } = currentWeather;
  const { lat, lon } = coord;

  // Get API key from environment variables
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  const mapTypes = [
    { id: 'temp_new', name: 'Temperature' },
    { id: 'precipitation_new', name: 'Precipitation' },
    { id: 'wind_new', name: 'Wind' },
    { id: 'clouds_new', name: 'Clouds' }
  ];

  const mapUrl = `https://tile.openweathermap.org/map/${mapType}/{z}/{x}/{y}.png?appid=${API_KEY}`;

  const mapButtonStyle = (isSelected) => ({
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    marginRight: '0.5rem',
    backgroundColor: isSelected ? 'var(--color-primary)' : '#e5e7eb',
    color: isSelected ? 'white' : 'var(--color-gray-dark)'
  });

  return (
    <div className="weather-card">
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: 'var(--color-gray-dark)',
        marginBottom: '1rem'
      }} className="dark-text">Weather Map</h2>

      <div style={{
        display: 'flex',
        marginBottom: '1rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        gap: '0.5rem'
      }}>
        {mapTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setMapType(type.id)}
            style={mapButtonStyle(mapType === type.id)}
            className={mapType === type.id ? '' : 'dark-bg-secondary dark-text'}
            onMouseOver={(e) => {
              if (mapType !== type.id) {
                e.currentTarget.style.backgroundColor = '#d1d5db';
              }
            }}
            onMouseOut={(e) => {
              if (mapType !== type.id) {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }
            }}
          >
            {type.name}
          </button>
        ))}
      </div>

      <div style={{
        position: 'relative',
        width: '100%',
        height: '16rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        '@media (min-width: 768px)': {
          height: '20rem'
        }
      }} className="dark-bg-secondary">
        <iframe
          title="Weather Map"
          style={{
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          src={`https://openweathermap.org/weathermap?basemap=map&cities=false&layer=${mapType}&lat=${lat}&lon=${lon}&zoom=10`}
          allowFullScreen
        ></iframe>

        <div style={{
          position: 'absolute',
          bottom: '0.5rem',
          right: '0.5rem',
          backgroundColor: 'white',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.25rem',
          fontSize: '0.75rem',
          color: 'var(--color-gray)'
        }} className="dark-bg-primary dark-text-secondary">
          © OpenWeatherMap
        </div>
      </div>

      <div style={{
        marginTop: '1rem',
        fontSize: '0.875rem',
        color: 'var(--color-gray)'
      }} className="dark-text-secondary">
        <p>Interactive weather map showing {mapTypes.find(t => t.id === mapType)?.name.toLowerCase()} data for the selected location and surrounding areas.</p>
      </div>
    </div>
  );
};

export default WeatherMap;
