import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { formatDate } from '../utils/helpers';

const WeatherChart = () => {
  const { forecast, units } = useWeather();
  const [chartType, setChartType] = useState('temperature');
  const canvasRef = useRef(null);

  if (!forecast) {
    return (
      <div className="weather-card">
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: 'var(--color-gray-dark)',
          marginBottom: '1rem'
        }} className="dark-text">Weather Chart</h2>
        <p>Forecast data is currently unavailable.</p>
      </div>
    );
  }

  // Check if forecast data is valid
  if (!forecast.list || !Array.isArray(forecast.list) || forecast.list.length === 0) {
    return (
      <div className="weather-card">
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: 'var(--color-gray-dark)',
          marginBottom: '1rem'
        }} className="dark-text">Weather Chart</h2>
        <p>Forecast data is incomplete. Please try again later.</p>
      </div>
    );
  }

  // Get the first 8 items (24 hours) from the forecast
  const hourlyData = forecast.list.slice(0, 8);

  const chartButtonStyle = (isSelected) => ({
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    marginRight: '0.5rem',
    backgroundColor: isSelected ? 'var(--color-primary)' : '#e5e7eb',
    color: isSelected ? 'white' : 'var(--color-gray-dark)'
  });

  useEffect(() => {
    if (!canvasRef.current || !hourlyData.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Check if dark mode is enabled
    const isDarkMode = document.body.classList.contains('dark');

    // Draw background
    ctx.fillStyle = isDarkMode ? '#1f2937' : '#f8fafc'; // background color
    ctx.fillRect(0, 0, width, height);

    // Get data based on chart type
    let data = [];
    let minValue = 0;
    let maxValue = 0;
    let unit = '';

    switch (chartType) {
      case 'temperature':
        data = hourlyData.map(item => item.main.temp);
        minValue = Math.min(...data) - 2;
        maxValue = Math.max(...data) + 2;
        unit = units === 'metric' ? '°C' : '°F';
        break;
      case 'humidity':
        data = hourlyData.map(item => item.main.humidity);
        minValue = 0;
        maxValue = 100;
        unit = '%';
        break;
      case 'wind':
        data = hourlyData.map(item => item.wind.speed);
        minValue = 0;
        maxValue = Math.max(...data) + 2;
        unit = units === 'metric' ? 'm/s' : 'mph';
        break;
      default:
        data = hourlyData.map(item => item.main.temp);
        minValue = Math.min(...data) - 2;
        maxValue = Math.max(...data) + 2;
        unit = units === 'metric' ? '°C' : '°F';
    }

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = isDarkMode ? '#6b7280' : '#94a3b8'; // axis color
    ctx.lineWidth = 1;

    // X-axis
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);

    // Y-axis
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw X-axis labels (time)
    ctx.fillStyle = isDarkMode ? '#d1d5db' : '#64748b'; // label color
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';

    const stepX = chartWidth / (hourlyData.length - 1);
    hourlyData.forEach((item, index) => {
      const x = padding + index * stepX;
      const time = formatDate(item.dt, 'time');
      ctx.fillText(time, x, height - padding + 15);
    });

    // Draw Y-axis labels
    ctx.textAlign = 'right';
    const stepY = chartHeight / 4;
    const valueStep = (maxValue - minValue) / 4;

    for (let i = 0; i <= 4; i++) {
      const y = height - padding - i * stepY;
      const value = minValue + i * valueStep;
      ctx.fillText(`${Math.round(value)}${unit}`, padding - 5, y + 3);
    }

    // Draw grid lines
    ctx.beginPath();
    ctx.strokeStyle = isDarkMode ? '#374151' : '#e2e8f0'; // grid color
    ctx.lineWidth = 0.5;

    // Horizontal grid lines
    for (let i = 1; i <= 4; i++) {
      const y = height - padding - i * stepY;
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
    }

    // Vertical grid lines
    for (let i = 1; i < hourlyData.length; i++) {
      const x = padding + i * stepX;
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
    }
    ctx.stroke();

    // Draw data line
    ctx.beginPath();
    ctx.strokeStyle = 'var(--color-primary)'; // line color
    ctx.lineWidth = 2;

    // Calculate scale for data points
    const scaleY = chartHeight / (maxValue - minValue);

    data.forEach((value, index) => {
      const x = padding + index * stepX;
      const y = height - padding - (value - minValue) * scaleY;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw data points
    data.forEach((value, index) => {
      const x = padding + index * stepX;
      const y = height - padding - (value - minValue) * scaleY;

      ctx.beginPath();
      ctx.fillStyle = 'var(--color-primary)'; // point color
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = isDarkMode ? '#1f2937' : '#ffffff'; // inner point color
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw data values
    ctx.fillStyle = isDarkMode ? 'var(--color-primary-light)' : 'var(--color-primary-dark)'; // value color
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';

    data.forEach((value, index) => {
      const x = padding + index * stepX;
      const y = height - padding - (value - minValue) * scaleY;
      let displayValue = Math.round(value);

      if (chartType === 'temperature') {
        displayValue = `${displayValue}${unit}`;
      } else if (chartType === 'humidity') {
        displayValue = `${displayValue}%`;
      } else if (chartType === 'wind') {
        displayValue = `${displayValue.toFixed(1)}`;
      }

      ctx.fillText(displayValue, x, y - 10);
    });

  }, [forecast, chartType, units, hourlyData]);

  return (
    <div className="weather-card">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <motion.h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--color-gray-dark)',
              display: 'flex',
              alignItems: 'center'
            }}
            className="dark-text"
            whileHover={{ scale: 1.03 }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: '0.5rem' }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
              <line x1="2" y1="20" x2="22" y2="20"></line>
            </motion.svg>
            Weather Forecast Chart
          </motion.h2>

          <motion.div
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-primary)',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center'
            }}
            whileHover={{ scale: 1.05 }}
          >
            <span>24-hour forecast</span>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: '0.25rem' }}
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </motion.svg>
          </motion.div>
        </div>

        <motion.div
          style={{
            display: 'flex',
            marginBottom: '1.5rem',
            gap: '0.75rem',
            justifyContent: 'center'
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.button
            onClick={() => setChartType('temperature')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem 1.25rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              fontSize: '0.875rem',
              backgroundColor: chartType === 'temperature' ? 'var(--color-primary)' : 'rgba(229, 231, 235, 0.5)',
              color: chartType === 'temperature' ? 'white' : 'var(--color-gray-dark)',
              border: chartType === 'temperature' ? 'none' : '1px solid rgba(229, 231, 235, 0.8)',
              boxShadow: chartType === 'temperature' ? '0 4px 10px rgba(59, 130, 246, 0.3)' : '0 2px 5px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease'
            }}
            className={chartType === 'temperature' ? '' : 'dark-bg-secondary dark-text'}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: '0.5rem' }}
              animate={chartType === 'temperature' ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
            </motion.svg>
            Temperature
          </motion.button>

          <motion.button
            onClick={() => setChartType('humidity')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem 1.25rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              fontSize: '0.875rem',
              backgroundColor: chartType === 'humidity' ? 'var(--color-primary)' : 'rgba(229, 231, 235, 0.5)',
              color: chartType === 'humidity' ? 'white' : 'var(--color-gray-dark)',
              border: chartType === 'humidity' ? 'none' : '1px solid rgba(229, 231, 235, 0.8)',
              boxShadow: chartType === 'humidity' ? '0 4px 10px rgba(59, 130, 246, 0.3)' : '0 2px 5px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease'
            }}
            className={chartType === 'humidity' ? '' : 'dark-bg-secondary dark-text'}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: '0.5rem' }}
              animate={chartType === 'humidity' ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
            </motion.svg>
            Humidity
          </motion.button>

          <motion.button
            onClick={() => setChartType('wind')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem 1.25rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              fontSize: '0.875rem',
              backgroundColor: chartType === 'wind' ? 'var(--color-primary)' : 'rgba(229, 231, 235, 0.5)',
              color: chartType === 'wind' ? 'white' : 'var(--color-gray-dark)',
              border: chartType === 'wind' ? 'none' : '1px solid rgba(229, 231, 235, 0.8)',
              boxShadow: chartType === 'wind' ? '0 4px 10px rgba(59, 130, 246, 0.3)' : '0 2px 5px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease'
            }}
            className={chartType === 'wind' ? '' : 'dark-bg-secondary dark-text'}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: '0.5rem' }}
              animate={chartType === 'wind' ? { rotate: [0, 15, 0, -15, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
            </motion.svg>
            Wind Speed
          </motion.button>
        </motion.div>

        <motion.div
          style={{
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '1rem',
            padding: '1rem',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          className="dark-bg-primary"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)' }}
        >
          <canvas
            ref={canvasRef}
            width="600"
            height="300"
            style={{ width: '100%', height: 'auto' }}
          ></canvas>

          <motion.div
            style={{
              marginTop: '1rem',
              fontSize: '0.875rem',
              color: 'var(--color-primary)',
              fontWeight: '500',
              textAlign: 'center',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(59, 130, 246, 0.1)'
            }}
            className="dark-text-secondary"
            whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
          >
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: '0.5rem' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </motion.svg>
              Showing {chartType} data for the next 24 hours
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WeatherChart;
