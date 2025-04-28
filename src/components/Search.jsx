import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useWeather } from '../context/WeatherContext';

const Search = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const inputRef = useRef(null);
  const {
    fetchWeatherData,
    searchHistory,
    clearSearchHistory,
    fetchWeatherByLocation,
    geoLoaded,
    geoError
  } = useWeather();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Add a visual feedback animation
      const searchButton = e.currentTarget.querySelector('button[type="submit"]');
      if (searchButton) {
        searchButton.style.transform = 'scale(0.95)';
        searchButton.style.backgroundColor = 'var(--color-primary-dark)';
        setTimeout(() => {
          searchButton.style.transform = '';
          searchButton.style.backgroundColor = '';
        }, 200);
      }

      // Add a small delay for better UX
      setTimeout(() => {
        fetchWeatherData(query);
        setQuery('');
        inputRef.current.blur();
      }, 100);
    }
  };

  const handleHistoryClick = (city) => {
    fetchWeatherData(city);
  };

  const handleLocationClick = () => {
    setQuery(''); // Clear the search input
    setIsLocating(true); // Show loading state

    console.log('Accessing your location...');

    if (!navigator.geolocation) {
      setIsLocating(false);
      alert('Geolocation is not supported by your browser');
      return;
    }

    // Set a timeout to handle cases where the browser hangs
    const timeoutId = setTimeout(() => {
      setIsLocating(false);
      alert('Location request timed out. Using default location instead.');
      fetchWeatherData('London');
    }, 15000); // 15 seconds timeout

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          console.log('Location obtained successfully:', position.coords);

          // Use the coordinates to fetch weather data
          fetchWeatherByLocation(
            position.coords.latitude,
            position.coords.longitude
          );

          setIsLocating(false);
        },
        (error) => {
          clearTimeout(timeoutId);
          console.error('Geolocation error:', error);

          let errorMessage = 'Unable to get your location. ';

          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'You denied the request for geolocation. Please enable location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'The request to get your location timed out.';
              break;
            default:
              errorMessage += 'An unknown error occurred.';
          }

          setIsLocating(false);
          alert(errorMessage);

          // Fall back to default city
          fetchWeatherData('London');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,  // Increased timeout
          maximumAge: 0
        }
      );
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Error in geolocation request:', err);

      setIsLocating(false);
      alert('Failed to access location services. Using default location instead.');

      // Fall back to default city
      fetchWeatherData('London');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      style={{
        width: '100%',
        maxWidth: '28rem',
        margin: '0 auto',
        marginBottom: '1.5rem',
        position: 'relative',
        zIndex: 10
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          marginBottom: '0.5rem',
          position: 'relative'
        }}
        variants={itemVariants}
      >
        <motion.div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            boxShadow: isFocused
              ? '0 0 0 3px rgba(59, 130, 246, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1)'
              : '0 2px 5px rgba(0, 0, 0, 0.1)',
            borderRadius: '0.75rem',
            transition: 'box-shadow 0.3s ease'
          }}
          animate={{
            scale: isFocused ? 1.02 : 1
          }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search for a city..."
            style={{
              flexGrow: 1,
              padding: '0.75rem 1rem',
              paddingLeft: '2.5rem',
              color: 'var(--color-gray-dark)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.75rem 0 0 0.75rem',
              borderRight: 'none',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease',
              letterSpacing: '0.01em',
              fontWeight: '500',
              boxShadow: isFocused ? 'inset 0 2px 4px rgba(0, 0, 0, 0.05)' : 'none'
            }}
            className="dark-bg-secondary dark-text"
          />
          <motion.div
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-gray)',
              pointerEvents: 'none'
            }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </motion.div>
          <motion.button
            type="submit"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 15px rgba(67, 97, 238, 0.5)',
              background: 'var(--gradient-primary)'
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'var(--color-primary)',
              color: 'white',
              borderRadius: '0 0.75rem 0.75rem 0',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease'
            }}
          >
            <motion.span
              initial={{ opacity: 0.8 }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Search
            </motion.span>
            <motion.span
              animate={{
                x: [0, 5, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
              style={{
                marginLeft: '0.5rem',
                display: 'inline-block',
                filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))'
              }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.form>

      <motion.div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}
        variants={itemVariants}
      >
        <motion.button
          onClick={handleLocationClick}
          whileHover={!isLocating ? { scale: 1.05, boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' } : {}}
          whileTap={!isLocating ? { scale: 0.95 } : {}}
          disabled={isLocating}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: 'white',
            backgroundColor: isLocating ? 'var(--color-primary-dark)' : 'var(--color-primary)',
            backdropFilter: 'blur(5px)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(147, 197, 253, 0.5)',
            boxShadow: isLocating
              ? '0 0 20px rgba(59, 130, 246, 0.5), 0 0 0 2px rgba(59, 130, 246, 0.5)'
              : '0 4px 10px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.3s ease',
            cursor: isLocating ? 'wait' : 'pointer',
            opacity: isLocating ? 0.9 : 1
          }}
        >
          {isLocating ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                marginRight: '0.75rem',
                width: '20px',
                height: '20px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%'
              }}
            />
          ) : (
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              style={{
                marginRight: '0.75rem',
                filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </motion.div>
          )}

          <span style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>
            {isLocating ? 'Locating...' : 'Use my location'}
          </span>

          {!isLocating && (
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              style={{ marginLeft: '0.5rem', fontSize: '1.25rem' }}
            >
              →
            </motion.span>
          )}
        </motion.button>

        {searchHistory.length > 0 && (
          <motion.button
            onClick={clearSearchHistory}
            whileHover={{ scale: 1.05, color: '#ef4444' }}
            whileTap={{ scale: 0.95 }}
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-gray)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem'
            }}
          >
            Clear history
          </motion.button>
        )}
      </motion.div>

      <AnimatePresence>
        {searchHistory.length > 0 && (
          <motion.div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              padding: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(5px)',
              borderRadius: '0.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {searchHistory.map((city, index) => (
              <motion.button
                key={city}
                onClick={() => handleHistoryClick(city)}
                whileHover={{ scale: 1.05, backgroundColor: 'var(--color-primary-light)' }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  backgroundColor: 'rgba(229, 231, 235, 0.5)',
                  color: 'var(--color-gray-dark)',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                className="dark-bg-secondary dark-text"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem' }}>
                  <polyline points="9 10 4 15 9 20"></polyline>
                  <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
                </svg>
                {city}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Search;
