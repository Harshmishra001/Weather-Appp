import { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { formatDate, formatTemperature, getWeatherIconUrl, groupForecastByDay } from '../utils/helpers';

const Forecast = () => {
  const { forecast, units } = useWeather();
  const [selectedDay, setSelectedDay] = useState(null);

  if (!forecast || !forecast.list || !Array.isArray(forecast.list)) {
    console.error("Invalid forecast data:", forecast);
    return (
      <div className="weather-card">
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: 'var(--color-gray-dark)',
          marginBottom: '1rem'
        }} className="dark-text">5-Day Forecast</h2>
        <p>Forecast data is currently unavailable. Please try again later.</p>
      </div>
    );
  }

  // Safely process forecast data
  try {
    const dailyForecast = groupForecastByDay(forecast.list);

    // If no day is selected, select the first day
    if (!selectedDay && dailyForecast.length > 0) {
      setSelectedDay(dailyForecast[0].day);
    }

    const selectedDayData = dailyForecast.find(day => day.day === selectedDay);

    const dayButtonStyle = (isSelected) => ({
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0.75rem',
    marginRight: '0.5rem',
    borderRadius: '0.5rem',
    transition: 'background-color 0.2s ease',
    backgroundColor: isSelected ? 'var(--color-primary)' : '#f3f4f6',
    color: isSelected ? 'white' : 'var(--color-gray-dark)'
  });

  return (
    <div className="weather-card">
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: 'var(--color-gray-dark)',
        marginBottom: '1rem'
      }} className="dark-text">5-Day Forecast</h2>

      <div style={{
        display: 'flex',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        marginBottom: '1rem',
        marginLeft: '-1.5rem',
        marginRight: '-1.5rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem'
      }}>
        {dailyForecast.map((day) => (
          <button
            key={day.day}
            onClick={() => setSelectedDay(day.day)}
            style={dayButtonStyle(selectedDay === day.day)}
            className={selectedDay === day.day ? '' : 'dark-bg-secondary dark-text'}
            onMouseOver={(e) => {
              if (selectedDay !== day.day) {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseOut={(e) => {
              if (selectedDay !== day.day) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
          >
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              {formatDate(day.summary.dt, 'day')}
            </span>
            <img
              src={getWeatherIconUrl(day.summary.weather[0].icon)}
              alt={day.summary.weather[0].description}
              style={{ width: '2.5rem', height: '2.5rem', margin: '0.25rem 0' }}
            />
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
              {formatTemperature(day.summary.main.temp, units)}
            </span>
          </button>
        ))}
      </div>

      {selectedDayData && (
        <div>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: 'var(--color-gray)',
            marginBottom: '0.5rem'
          }} className="dark-text-secondary">
            Hourly Forecast for {new Date(selectedDayData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ minWidth: '100%' }}>
              <thead>
                <tr style={{ textAlign: 'left', fontSize: '0.75rem', color: 'var(--color-gray)' }}>
                  <th style={{ padding: '0.5rem 1rem 0.5rem 0' }}>Time</th>
                  <th style={{ padding: '0.5rem 1rem 0.5rem 0' }}>Condition</th>
                  <th style={{ padding: '0.5rem 1rem 0.5rem 0' }}>Temp</th>
                  <th style={{ padding: '0.5rem 1rem 0.5rem 0' }}>Feels Like</th>
                  <th style={{ padding: '0.5rem 1rem 0.5rem 0' }}>Humidity</th>
                  <th style={{ padding: '0.5rem 1rem 0.5rem 0' }}>Wind</th>
                </tr>
              </thead>
              <tbody>
                {selectedDayData.hourly.map((hour) => (
                  <tr key={hour.dt} style={{ borderTop: '1px solid #e5e7eb' }} className="dark-border">
                    <td style={{
                      padding: '0.5rem 1rem 0.5rem 0',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: 'var(--color-gray-dark)'
                    }} className="dark-text">
                      {formatDate(hour.dt, 'time')}
                    </td>
                    <td style={{ padding: '0.5rem 1rem 0.5rem 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                          src={getWeatherIconUrl(hour.weather[0].icon)}
                          alt={hour.weather[0].description}
                          style={{ width: '2rem', height: '2rem', marginRight: '0.25rem' }}
                        />
                        <span style={{
                          fontSize: '0.875rem',
                          color: 'var(--color-gray)',
                          textTransform: 'capitalize'
                        }} className="dark-text-secondary">
                          {hour.weather[0].description}
                        </span>
                      </div>
                    </td>
                    <td style={{
                      padding: '0.5rem 1rem 0.5rem 0',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'var(--color-gray-dark)'
                    }} className="dark-text">
                      {formatTemperature(hour.main.temp, units)}
                    </td>
                    <td style={{
                      padding: '0.5rem 1rem 0.5rem 0',
                      fontSize: '0.875rem',
                      color: 'var(--color-gray)'
                    }} className="dark-text-secondary">
                      {formatTemperature(hour.main.feels_like, units)}
                    </td>
                    <td style={{
                      padding: '0.5rem 1rem 0.5rem 0',
                      fontSize: '0.875rem',
                      color: 'var(--color-gray)'
                    }} className="dark-text-secondary">
                      {hour.main.humidity}%
                    </td>
                    <td style={{
                      padding: '0.5rem 1rem 0.5rem 0',
                      fontSize: '0.875rem',
                      color: 'var(--color-gray)'
                    }} className="dark-text-secondary">
                      {hour.wind.speed} {units === 'metric' ? 'm/s' : 'mph'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
  } catch (error) {
    console.error("Error processing forecast data:", error);
    return (
      <div className="weather-card">
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: 'var(--color-gray-dark)',
          marginBottom: '1rem'
        }} className="dark-text">5-Day Forecast</h2>
        <p>There was an error processing the forecast data. Please try again later.</p>
      </div>
    );
  }
};

export default Forecast;
