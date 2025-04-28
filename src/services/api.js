// Get API key from environment variables
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Check if API key is available
if (!API_KEY) {
  console.error('OpenWeatherMap API key is missing! Please check your .env file.');
}

/**
 * Helper function to handle API requests with better error handling
 * @param {string} url - API URL
 * @param {string} errorMessage - Custom error message
 * @returns {Promise<Object>} - JSON response
 */
const fetchWithErrorHandling = async (url, errorMessage) => {
  // Check if API key is available before making the request
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is missing. Please check your environment variables.');
  }

  try {
    console.log(`Fetching: ${url.replace(API_KEY, 'API_KEY_HIDDEN')}`); // Log URL without exposing API key

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        // Ignore JSON parsing errors
      }

      console.error(`API Error (${response.status}):`, errorData);

      if (response.status === 404) {
        throw new Error('Location not found. Please check the city name and try again.');
      } else if (response.status === 401) {
        throw new Error('API key is invalid or expired. Please check your API key in the .env file.');
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      } else {
        throw new Error(`${errorMessage} (Status: ${response.status})`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection and try again.');
    }
    console.error(`Error in fetchWithErrorHandling:`, error);
    throw error;
  }
};

/**
 * Fetch current weather data for a location
 * @param {string} location - City name or coordinates
 * @param {string} units - Units of measurement (metric, imperial, standard)
 * @returns {Promise} - Weather data
 */
export const fetchCurrentWeather = async (location, units = 'metric') => {
  return fetchWithErrorHandling(
    `${BASE_URL}/weather?q=${location}&units=${units}&appid=${API_KEY}`,
    'Failed to fetch current weather data'
  );
};

/**
 * Fetch 5-day forecast data for a location
 * @param {string} location - City name or coordinates
 * @param {string} units - Units of measurement (metric, imperial, standard)
 * @returns {Promise} - Forecast data
 */
export const fetchForecast = async (location, units = 'metric') => {
  return fetchWithErrorHandling(
    `${BASE_URL}/forecast?q=${location}&units=${units}&appid=${API_KEY}`,
    'Failed to fetch forecast data'
  );
};

/**
 * Fetch air pollution data for coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise} - Air pollution data
 */
export const fetchAirPollution = async (lat, lon) => {
  return fetchWithErrorHandling(
    `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
    'Failed to fetch air pollution data'
  );
};

/**
 * Fetch weather data by coordinates (for geolocation)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} units - Units of measurement (metric, imperial, standard)
 * @returns {Promise} - Weather data
 */
export const fetchWeatherByCoords = async (lat, lon, units = 'metric') => {
  return fetchWithErrorHandling(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`,
    'Failed to fetch weather data by coordinates'
  );
};

/**
 * Fetch forecast data by coordinates (for geolocation)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} units - Units of measurement (metric, imperial, standard)
 * @returns {Promise} - Forecast data
 */
export const fetchForecastByCoords = async (lat, lon, units = 'metric') => {
  return fetchWithErrorHandling(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`,
    'Failed to fetch forecast data by coordinates'
  );
};
