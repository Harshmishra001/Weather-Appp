/**
 * Format temperature with unit
 * @param {number} temp - Temperature value
 * @param {string} unit - Unit of measurement (metric, imperial)
 * @returns {string} - Formatted temperature
 */
export const formatTemperature = (temp, unit = 'metric') => {
  const roundedTemp = Math.round(temp);
  const unitSymbol = unit === 'imperial' ? '°F' : '°C';
  return `${roundedTemp}${unitSymbol}`;
};

/**
 * Format date from timestamp
 * @param {number} timestamp - Unix timestamp
 * @param {string} format - Date format (full, day, time)
 * @returns {string} - Formatted date
 */
export const formatDate = (timestamp, format = 'full') => {
  const date = new Date(timestamp * 1000);
  
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  switch (format) {
    case 'day':
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    case 'time':
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    default:
      return date.toLocaleString('en-US', options);
  }
};

/**
 * Group forecast data by day
 * @param {Array} forecastList - List of forecast data points
 * @returns {Array} - Grouped forecast data
 */
export const groupForecastByDay = (forecastList) => {
  const grouped = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toISOString().split('T')[0];
    
    if (!grouped[day]) {
      grouped[day] = [];
    }
    
    grouped[day].push(item);
  });
  
  return Object.keys(grouped).map(day => {
    const dayData = grouped[day];
    // Find the item closest to noon for the day summary
    const noon = new Date(day);
    noon.setHours(12, 0, 0, 0);
    const noonTimestamp = noon.getTime();
    
    let closestToNoon = dayData[0];
    let minDiff = Math.abs(new Date(dayData[0].dt * 1000).getTime() - noonTimestamp);
    
    dayData.forEach(item => {
      const diff = Math.abs(new Date(item.dt * 1000).getTime() - noonTimestamp);
      if (diff < minDiff) {
        minDiff = diff;
        closestToNoon = item;
      }
    });
    
    return {
      day,
      date: new Date(day),
      summary: closestToNoon,
      hourly: dayData
    };
  });
};

/**
 * Get weather icon URL
 * @param {string} iconCode - Weather icon code
 * @param {number} size - Icon size (1x, 2x, 4x)
 * @returns {string} - Icon URL
 */
export const getWeatherIconUrl = (iconCode, size = '2x') => {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
};

/**
 * Get air quality index description
 * @param {number} aqi - Air quality index (1-5)
 * @returns {Object} - AQI description and color
 */
export const getAirQualityDescription = (aqi) => {
  const descriptions = [
    { level: 'Good', color: 'green' },
    { level: 'Fair', color: 'yellow' },
    { level: 'Moderate', color: 'orange' },
    { level: 'Poor', color: 'red' },
    { level: 'Very Poor', color: 'purple' }
  ];
  
  return descriptions[aqi - 1] || { level: 'Unknown', color: 'gray' };
};

/**
 * Convert wind speed to beaufort scale
 * @param {number} speed - Wind speed in m/s
 * @returns {number} - Beaufort scale (0-12)
 */
export const getBeaufortScale = (speed) => {
  const kmhSpeed = speed * 3.6; // Convert m/s to km/h
  
  if (kmhSpeed < 1) return 0;
  if (kmhSpeed < 6) return 1;
  if (kmhSpeed < 12) return 2;
  if (kmhSpeed < 20) return 3;
  if (kmhSpeed < 29) return 4;
  if (kmhSpeed < 39) return 5;
  if (kmhSpeed < 50) return 6;
  if (kmhSpeed < 62) return 7;
  if (kmhSpeed < 75) return 8;
  if (kmhSpeed < 89) return 9;
  if (kmhSpeed < 103) return 10;
  if (kmhSpeed < 118) return 11;
  return 12;
};

/**
 * Get wind direction from degrees
 * @param {number} degrees - Wind direction in degrees
 * @returns {string} - Wind direction (N, NE, E, etc.)
 */
export const getWindDirection = (degrees) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};
