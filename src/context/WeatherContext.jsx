import { createContext, useContext, useEffect, useState } from 'react';
import useGeolocation from '../hooks/useGeolocation';
import {
    fetchAirPollution,
    fetchCurrentWeather,
    fetchForecast,
    fetchForecastByCoords,
    fetchWeatherByCoords
} from '../services/api';

const WeatherContext = createContext();

export const useWeather = () => useContext(WeatherContext);

export const WeatherProvider = ({ children }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('');
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('weatherSearchHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [units, setUnits] = useState(() => {
    const saved = localStorage.getItem('weatherUnits');
    return saved || 'metric';
  });

  const { coordinates, loaded: geoLoaded, error: geoError } = useGeolocation();

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Save units preference to localStorage
  useEffect(() => {
    localStorage.setItem('weatherUnits', units);
  }, [units]);

  // Get weather for user's location on initial load or use default city
  useEffect(() => {
    // Skip if we're already loading data
    if (loading) {
      return;
    }

    console.log("Geolocation status:", { geoLoaded, coordinates, location, currentWeather });

    // Function to load default city data
    const loadDefaultCity = async () => {
      console.log("Loading default city: London");
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching current weather data for London...");
        const weatherData = await fetchCurrentWeather("London", units);
        console.log("Weather data received for London:", weatherData);
        setCurrentWeather(weatherData);

        console.log("Fetching forecast data for London...");
        const forecastData = await fetchForecast("London", units);
        console.log("Forecast data received for London:", forecastData);
        setForecast(forecastData);

        const { coord } = weatherData;
        console.log("Fetching air quality data for London coordinates:", coord);
        try {
          const airData = await fetchAirPollution(coord.lat, coord.lon);
          console.log("Air quality data received for London:", airData);
          setAirQuality(airData);
        } catch (airError) {
          console.error("Error fetching air quality data for London:", airError);
          setAirQuality(null);
        }

        setLocation("London");
        console.log("Location set to London");

        // Add to search history if not already present
        if (!searchHistory.includes("London")) {
          setSearchHistory(prev => ["London", ...prev].slice(0, 5));
          console.log("Added London to search history");
        }
      } catch (error) {
        console.error("Error loading default city:", error);
        setError("Failed to load weather data. Please try again later.");
        setCurrentWeather(null);
        setForecast(null);
        setAirQuality(null);
      } finally {
        setLoading(false);
      }
    };

    // Function to load weather data by coordinates
    const loadWeatherByCoordinates = async (lat, lng) => {
      console.log("Loading weather for coordinates:", { lat, lng });
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching current weather data by coordinates...");
        const weatherData = await fetchWeatherByCoords(lat, lng, units);
        console.log("Weather data received by coordinates:", weatherData);
        setCurrentWeather(weatherData);

        console.log("Fetching forecast data by coordinates...");
        const forecastData = await fetchForecastByCoords(lat, lng, units);
        console.log("Forecast data received by coordinates:", forecastData);
        setForecast(forecastData);

        console.log("Fetching air quality data by coordinates...");
        try {
          const airData = await fetchAirPollution(lat, lng);
          console.log("Air quality data received by coordinates:", airData);
          setAirQuality(airData);
        } catch (airError) {
          console.error("Error fetching air quality data by coordinates:", airError);
          setAirQuality(null);
        }

        setLocation(weatherData.name);
        console.log("Location set to:", weatherData.name);

        // Add to search history if not already present
        if (!searchHistory.includes(weatherData.name)) {
          setSearchHistory(prev => [weatherData.name, ...prev].slice(0, 5));
          console.log("Added to search history:", weatherData.name);
        }
      } catch (error) {
        console.error("Error loading weather by coordinates:", error);
        setError("Failed to fetch weather data for your location. Loading default city instead.");
        // If coordinates fail, load default city
        await loadDefaultCity();
      } finally {
        setLoading(false);
      }
    };

    // Decision tree for loading data
    const initializeWeatherData = async () => {
      // If we already have weather data, don't reload
      if (currentWeather) {
        return;
      }

      // If we have coordinates and no location set yet, use them
      if (geoLoaded && coordinates && coordinates.lat && !location) {
        await loadWeatherByCoordinates(coordinates.lat, coordinates.lng);
      }
      // If geolocation is loaded but we don't have coordinates and no location set yet, use default city
      else if (geoLoaded && (!coordinates || !coordinates.lat) && !location) {
        await loadDefaultCity();
      }
      // If nothing is loaded yet, use default city
      else if (!location && !currentWeather) {
        await loadDefaultCity();
      }
    };

    // Execute the initialization
    initializeWeatherData().catch(err => {
      console.error("Failed to initialize weather data:", err);
      setError("Failed to load weather data. Please try again later.");
      setLoading(false);
    });

  }, [geoLoaded, coordinates, location, loading, currentWeather, units, searchHistory]);

  const fetchWeatherByLocation = async (lat, lng) => {
    console.log("Fetching weather for location:", lat, lng);
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching current weather data...");
      const weatherData = await fetchWeatherByCoords(lat, lng, units);

      if (!weatherData) {
        throw new Error("Failed to fetch weather data for coordinates");
      }

      console.log("Weather data received:", weatherData);
      setCurrentWeather(weatherData);

      console.log("Fetching forecast data...");
      const forecastData = await fetchForecastByCoords(lat, lng, units);

      if (!forecastData) {
        throw new Error("Failed to fetch forecast data for coordinates");
      }

      console.log("Forecast data received:", forecastData);
      setForecast(forecastData);

      console.log("Fetching air quality data...");
      try {
        const airData = await fetchAirPollution(lat, lng);
        console.log("Air quality data received:", airData);
        setAirQuality(airData);
      } catch (airError) {
        // Don't fail the whole request if air quality data fails
        console.error("Error fetching air quality data:", airError);
        setAirQuality(null);
      }

      setLocation(weatherData.name);
      console.log("Location set to:", weatherData.name);

      // Add to search history if not already present
      if (!searchHistory.includes(weatherData.name)) {
        setSearchHistory(prev => [weatherData.name, ...prev].slice(0, 5));
        console.log("Added to search history:", weatherData.name);
      }
    } catch (err) {
      console.error("Error fetching weather by location:", err);
      setError(err.message || "Failed to fetch weather data for your location");
      setCurrentWeather(null);
      setForecast(null);
      setAirQuality(null);

      // Try to load a default city if coordinates fail
      console.log("Trying to load default city instead");
      try {
        // Direct API calls instead of using fetchWeatherData to avoid circular dependency
        setLoading(true);
        const defaultWeather = await fetchCurrentWeather("London", units);
        setCurrentWeather(defaultWeather);

        const defaultForecast = await fetchForecast("London", units);
        setForecast(defaultForecast);

        try {
          const defaultAirQuality = await fetchAirPollution(defaultWeather.coord.lat, defaultWeather.coord.lon);
          setAirQuality(defaultAirQuality);
        } catch (e) {
          setAirQuality(null);
        }

        setLocation("London");

        if (!searchHistory.includes("London")) {
          setSearchHistory(prev => ["London", ...prev].slice(0, 5));
        }

        setError(null);
      } catch (defaultError) {
        console.error("Error loading default city:", defaultError);
        setError("Failed to load weather data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async (city) => {
    console.log("Fetching weather data for city:", city);
    if (!city) {
      console.log("No city provided, returning");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Fetching current weather data for city...");
      const weatherData = await fetchCurrentWeather(city, units);

      if (!weatherData) {
        throw new Error("Failed to fetch weather data");
      }

      console.log("Weather data received for city:", weatherData);
      setCurrentWeather(weatherData);

      console.log("Fetching forecast data for city...");
      const forecastData = await fetchForecast(city, units);

      if (!forecastData) {
        throw new Error("Failed to fetch forecast data");
      }

      console.log("Forecast data received for city:", forecastData);
      setForecast(forecastData);

      const { coord } = weatherData;
      console.log("Fetching air quality data for city coordinates:", coord);

      try {
        const airData = await fetchAirPollution(coord.lat, coord.lon);
        console.log("Air quality data received for city:", airData);
        setAirQuality(airData);
      } catch (airError) {
        // Don't fail the whole request if air quality data fails
        console.error("Error fetching air quality data:", airError);
        setAirQuality(null);
      }

      setLocation(city);
      console.log("Location set to city:", city);

      // Add to search history if not already present
      if (!searchHistory.includes(city)) {
        setSearchHistory(prev => [city, ...prev].slice(0, 5));
        console.log("Added city to search history:", city);
      }
    } catch (err) {
      console.error("Error fetching weather data for city:", err);
      setError(err.message || "Failed to fetch weather data");
      setCurrentWeather(null);
      setForecast(null);
      setAirQuality(null);

      // Try to load a default city if the requested city fails
      if (city.toLowerCase() !== "london") {
        console.log("Trying to load default city instead");
        try {
          // Direct API calls instead of recursive fetchWeatherData call
          const defaultWeather = await fetchCurrentWeather("London", units);
          setCurrentWeather(defaultWeather);

          const defaultForecast = await fetchForecast("London", units);
          setForecast(defaultForecast);

          try {
            const defaultAirQuality = await fetchAirPollution(defaultWeather.coord.lat, defaultWeather.coord.lon);
            setAirQuality(defaultAirQuality);
          } catch (e) {
            setAirQuality(null);
          }

          setLocation("London");

          if (!searchHistory.includes("London")) {
            setSearchHistory(prev => ["London", ...prev].slice(0, 5));
          }

          setError(null);
        } catch (defaultError) {
          console.error("Error loading default city:", defaultError);
          setError("Failed to load weather data. Please try again later.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleUnits = () => {
    setUnits(prev => {
      const newUnits = prev === 'metric' ? 'imperial' : 'metric';
      // Refetch data with new units if we have a location
      if (location) {
        fetchWeatherData(location);
      }
      return newUnits;
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('weatherSearchHistory');
  };

  const value = {
    currentWeather,
    forecast,
    airQuality,
    loading,
    error,
    location,
    searchHistory,
    units,
    fetchWeatherData,
    fetchWeatherByLocation,
    toggleUnits,
    clearSearchHistory,
    geoLoaded,
    geoError
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherContext;
