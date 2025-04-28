import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';
import Search from './Search';
import CurrentWeather from './CurrentWeather';
import AirQuality from './AirQuality';
import Forecast from './Forecast';
import WeatherChart from './WeatherChart';
import WeatherMap from './WeatherMap';

const WeatherContent = () => {
  const { loading, error, currentWeather } = useWeather();

  // Loading spinner
  if (loading) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center" 
        style={{ minHeight: '60vh' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="loading-spinner"
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '4px solid rgba(59, 130, 246, 0.1)',
            borderTopColor: 'var(--color-primary)',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)'
          }}
        />
        <motion.p 
          className="mt-4 text-gray-600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ fontWeight: '500' }}
        >
          Loading weather data...
        </motion.p>
      </motion.div>
    );
  }

  // Error message
  if (error) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center" 
        style={{ minHeight: '60vh' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          style={{
            padding: '2rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '1rem',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            maxWidth: '500px',
            textAlign: 'center'
          }}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#ef4444" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ margin: '0 auto', marginBottom: '1rem' }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </motion.svg>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '0.5rem' }}>
            Error Loading Weather Data
          </h2>
          <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
            {error}
          </p>
          <motion.button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  // No weather data
  if (!currentWeather) {
    return (
      <>
        <Search />
        <motion.div 
          className="flex flex-col items-center justify-center" 
          style={{ minHeight: '40vh' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            style={{
              padding: '2rem',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '1rem',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              maxWidth: '500px',
              textAlign: 'center'
            }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="var(--color-primary)" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ margin: '0 auto', marginBottom: '1rem' }}
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                y: { duration: 2, repeat: Infinity },
                rotate: { duration: 3, repeat: Infinity }
              }}
            >
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
            </motion.svg>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              Search for a Location
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Enter a city name in the search box above or use the "Use my location" button to get weather data.
            </p>
          </motion.div>
        </motion.div>
      </>
    );
  }

  // Weather content
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Search />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <CurrentWeather />
          <AirQuality />
        </div>

        <div>
          <Forecast />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <WeatherChart />
        <WeatherMap />
      </div>
    </motion.div>
  );
};

export default WeatherContent;
