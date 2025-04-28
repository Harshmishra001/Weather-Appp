import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { MovableBackground } from './MovableBackground';
import { MoonIcon, SunIcon, WeatherIcon } from './WeatherIcons';

const Layout = ({ children }) => {
  const { currentWeather } = useWeather() || {};
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('weatherDarkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('weatherDarkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Get weather condition for background
  const getWeatherCondition = () => {
    if (!currentWeather || !currentWeather.weather) return 'clear';

    const mainCondition = currentWeather.weather[0].main.toLowerCase();

    if (mainCondition.includes('cloud')) return 'clouds';
    if (mainCondition.includes('rain') || mainCondition.includes('drizzle')) return 'rain';
    if (mainCondition.includes('snow')) return 'snow';
    return 'clear';
  };

  return (
    <div style={{
      minHeight: '100vh',
      transition: 'background-color 0.3s ease',
      position: 'relative',
      zIndex: 0
    }}>
      {/* Movable Animated Background */}
      <MovableBackground condition={getWeatherCondition()} darkMode={darkMode} />

      <motion.header
        style={{
          backdropFilter: 'blur(15px)',
          backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        <div className="container flex justify-between items-center" style={{ padding: '1rem' }}>
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              style={{
                marginRight: '0.75rem',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))',
                boxShadow: '0 4px 10px rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
            >
              <WeatherIcon size={28} />
            </motion.div>

            <div>
              <motion.h1
                className="text-xl font-bold"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em'
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                whileHover={{ scale: 1.05 }}
              >
                Weather App
              </motion.h1>
              <motion.p
                style={{
                  fontSize: '0.75rem',
                  color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
                  marginTop: '-2px'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Real-time weather data & forecasts
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                color: 'var(--color-primary)',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
              whileHover={{ scale: 1.05 }}
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
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </motion.svg>
              {currentWeather ? new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Loading...'}
            </motion.div>

            <motion.button
              onClick={toggleDarkMode}
              style={{
                padding: '0.75rem',
                borderRadius: '0.75rem',
                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                color: darkMode ? 'var(--color-white)' : 'var(--color-gray-dark)',
                boxShadow: darkMode ?
                  '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)' :
                  '0 4px 12px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(0, 0, 0, 0.05)'
              }}
              whileHover={{
                scale: 1.1,
                rotate: darkMode ? [0, 15] : [0, -15],
                boxShadow: darkMode ?
                  '0 8px 20px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.2)' :
                  '0 8px 20px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1)'
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon size={20} />
              ) : (
                <MoonIcon size={20} />
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Animated accent bar */}
        <motion.div
          style={{
            height: '3px',
            background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 50%, var(--color-primary) 100%)',
            backgroundSize: '200% 100%'
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </motion.header>

      <main className="container" style={{
        padding: '2rem 1rem',
        position: 'relative',
        zIndex: 1
      }}>
        {children}
      </main>

      <motion.footer
        style={{
          backdropFilter: 'blur(15px)',
          backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 10,
          borderTop: darkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {/* Animated accent bar */}
        <motion.div
          style={{
            height: '3px',
            background: 'var(--gradient-primary)',
            backgroundSize: '200% 100%'
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />

        <div className="container" style={{ padding: '1.5rem', fontSize: '0.875rem', color: 'var(--color-gray)' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            '@media (min-width: 768px)': {
              flexDirection: 'row',
              justifyContent: 'space-between'
            }
          }}>
            <motion.div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                <WeatherIcon size={20} />
              </motion.div>
              <div>
                <p style={{
                  fontWeight: '600',
                  fontSize: '1rem',
                  color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'
                }}>
                  Weather App
                </p>
                <p style={{
                  fontSize: '0.75rem',
                  color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
                }}>
                  © {new Date().getFullYear()} All rights reserved
                </p>
              </div>
            </motion.div>

            <motion.div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                '@media (min-width: 768px)': {
                  alignItems: 'flex-end'
                }
              }}
            >
              <motion.p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                  fontWeight: '500'
                }}
                whileHover={{ scale: 1.05 }}
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
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </motion.svg>
                Weather data powered by
                <motion.a
                  href="https://openweathermap.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  whileHover={{
                    scale: 1.05,
                    color: darkMode ? '#60a5fa' : '#2563eb'
                  }}
                >
                  OpenWeatherMap
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </motion.svg>
                </motion.a>
              </motion.p>

              {/* Made with love by Harsh Mishra */}
              <motion.div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.75rem 1.25rem',
                  backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  borderRadius: '1rem',
                  marginTop: '0.75rem',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--glass-border)'
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: 'var(--shadow-md)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                  marginRight: '0.5rem'
                }}>
                  Made with
                </span>

                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                  style={{
                    display: 'inline-block',
                    marginRight: '0.5rem',
                    color: 'var(--color-accent)'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </motion.div>

                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  background: 'var(--gradient-accent)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% auto'
                }}>
                  by Harsh Mishra
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Layout;
