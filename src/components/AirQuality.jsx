import { useWeather } from '../context/WeatherContext';
import { getAirQualityDescription } from '../utils/helpers';

const AirQuality = () => {
  const { airQuality } = useWeather();

  if (!airQuality || !airQuality.list || airQuality.list.length === 0) {
    return (
      <div className="weather-card">
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: 'var(--color-gray-dark)',
          marginBottom: '1rem'
        }} className="dark-text">Air Quality</h2>
        <p>Air quality data is currently unavailable.</p>
      </div>
    );
  }

  try {
    // Safely destructure with defaults
    const { main = {}, components = {} } = airQuality.list[0] || {};
    const { aqi = 1 } = main;
    const {
      co = 0,
      no2 = 0,
      o3 = 0,
      pm2_5 = 0,
      pm10 = 0,
      so2 = 0
    } = components;

  const { level, color } = getAirQualityDescription(aqi);

  // Get background color based on AQI level
  const getBgColor = () => {
    switch (color) {
      case 'green': return '#dcfce7';
      case 'yellow': return '#fef9c3';
      case 'orange': return '#ffedd5';
      case 'red': return '#fee2e2';
      case 'purple': return '#f3e8ff';
      default: return '#f3f4f6';
    }
  };

  // Get dark mode background color based on AQI level
  const getDarkBgColor = () => {
    switch (color) {
      case 'green': return '#166534';
      case 'yellow': return '#854d0e';
      case 'orange': return '#9a3412';
      case 'red': return '#991b1b';
      case 'purple': return '#6b21a8';
      default: return '#374151';
    }
  };

  // Get text color based on AQI level
  const getTextColor = () => {
    switch (color) {
      case 'green': return '#166534';
      case 'yellow': return '#854d0e';
      case 'orange': return '#9a3412';
      case 'red': return '#991b1b';
      case 'purple': return '#6b21a8';
      default: return 'var(--color-gray-dark)';
    }
  };

  // Get dark mode text color based on AQI level
  const getDarkTextColor = () => {
    switch (color) {
      case 'green': return '#bbf7d0';
      case 'yellow': return '#fef08a';
      case 'orange': return '#fed7aa';
      case 'red': return '#fecaca';
      case 'purple': return '#e9d5ff';
      default: return '#e5e7eb';
    }
  };

  const pollutantBoxStyle = {
    padding: '0.75rem',
    backgroundColor: '#f3f4f6',
    borderRadius: '0.5rem'
  };

  return (
    <div className="weather-card">
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: 'var(--color-gray-dark)',
        marginBottom: '1rem'
      }} className="dark-text">Air Quality</h2>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem',
        borderRadius: '0.5rem',
        backgroundColor: getBgColor(),
        marginBottom: '1rem'
      }} className="dark-mode-aqi">
        <div>
          <span style={{
            fontSize: '0.875rem',
            color: 'var(--color-gray)'
          }} className="dark-text-secondary">Air Quality Index</span>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: getTextColor()
          }} className="dark-mode-aqi-text">{level}</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }} className="dark-bg-primary">
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: getTextColor()
            }} className="dark-mode-aqi-text">{aqi}</span>
          </div>
          <span style={{
            marginLeft: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--color-gray)'
          }} className="dark-text-secondary">of 5</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.75rem',
        '@media (min-width: 768px)': {
          gridTemplateColumns: 'repeat(3, 1fr)'
        }
      }}>
        <div style={pollutantBoxStyle} className="dark-bg-secondary">
          <span style={{
            fontSize: '0.875rem',
            color: 'var(--color-gray)'
          }}>CO</span>
          <p style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: 'var(--color-gray-dark)'
          }} className="dark-text">{co.toFixed(1)} μg/m³</p>
        </div>

        <div style={pollutantBoxStyle} className="dark-bg-secondary">
          <span style={{
            fontSize: '0.875rem',
            color: 'var(--color-gray)'
          }}>NO₂</span>
          <p style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: 'var(--color-gray-dark)'
          }} className="dark-text">{no2.toFixed(1)} μg/m³</p>
        </div>

        <div style={pollutantBoxStyle} className="dark-bg-secondary">
          <span style={{
            fontSize: '0.875rem',
            color: 'var(--color-gray)'
          }}>O₃</span>
          <p style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: 'var(--color-gray-dark)'
          }} className="dark-text">{o3.toFixed(1)} μg/m³</p>
        </div>

        <div style={pollutantBoxStyle} className="dark-bg-secondary">
          <span style={{
            fontSize: '0.875rem',
            color: 'var(--color-gray)'
          }}>PM2.5</span>
          <p style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: 'var(--color-gray-dark)'
          }} className="dark-text">{pm2_5.toFixed(1)} μg/m³</p>
        </div>

        <div style={pollutantBoxStyle} className="dark-bg-secondary">
          <span style={{
            fontSize: '0.875rem',
            color: 'var(--color-gray)'
          }}>PM10</span>
          <p style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: 'var(--color-gray-dark)'
          }} className="dark-text">{pm10.toFixed(1)} μg/m³</p>
        </div>

        <div style={pollutantBoxStyle} className="dark-bg-secondary">
          <span style={{
            fontSize: '0.875rem',
            color: 'var(--color-gray)'
          }}>SO₂</span>
          <p style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: 'var(--color-gray-dark)'
          }} className="dark-text">{so2.toFixed(1)} μg/m³</p>
        </div>
      </div>

      <div style={{
        marginTop: '1rem',
        fontSize: '0.875rem',
        color: 'var(--color-gray)'
      }} className="dark-text-secondary">
        <p>
          <strong>Note:</strong> Air quality index is based on the concentration of pollutants.
          1 (Good) to 5 (Very Poor).
        </p>
      </div>
    </div>
  );
  } catch (error) {
    console.error("Error rendering air quality data:", error);
    return (
      <div className="weather-card">
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: 'var(--color-gray-dark)',
          marginBottom: '1rem'
        }} className="dark-text">Air Quality</h2>
        <p>There was an error processing the air quality data. Please try again later.</p>
      </div>
    );
  }
};

export default AirQuality;
