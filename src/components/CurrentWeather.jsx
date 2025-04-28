import { motion } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';
import { formatDate, formatTemperature, getWeatherIconUrl, getWindDirection } from '../utils/helpers';
import {
    DropletIcon,
    PressureIcon,
    SunriseIcon,
    SunsetIcon,
    ThermometerIcon,
    WindIcon
} from './WeatherIcons';

const CurrentWeather = () => {
  const { currentWeather, units, toggleUnits } = useWeather();

  if (!currentWeather) return null;

  // Check if all required properties exist
  if (!currentWeather.main || !currentWeather.weather ||
      !currentWeather.wind || !currentWeather.sys ||
      !Array.isArray(currentWeather.weather) ||
      currentWeather.weather.length === 0) {
    console.error("Incomplete weather data:", currentWeather);
    return (
      <div className="weather-card">
        <p>Weather data is incomplete. Please try again later.</p>
      </div>
    );
  }

  // Safely destructure with defaults
  const {
    name = "Unknown",
    main = {},
    weather = [{ description: "Unknown", icon: "01d" }],
    wind = { speed: 0, deg: 0 },
    sys = {},
    dt = Date.now() / 1000
  } = currentWeather;

  const { temp = 0, feels_like = 0, humidity = 0, pressure = 0 } = main;
  const { country = "", sunrise = dt, sunset = dt + 43200 } = sys;

  const weatherDescription = weather[0]?.description || "Unknown";
  const iconUrl = getWeatherIconUrl(weather[0]?.icon || "01d", '4x');
  const windDirection = getWindDirection(wind.deg || 0);

  const weatherInfoStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0.75rem',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(239, 246, 255, 0.8))',
    backdropFilter: 'blur(10px)',
    borderRadius: '0.75rem',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease'
  };

  const labelStyle = {
    fontSize: '0.875rem',
    color: 'var(--color-gray)',
    marginTop: '0.25rem',
    fontWeight: '500'
  };

  const valueStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'var(--color-gray-dark)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className="weather-card"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        '@media (min-width: 768px)': {
          flexDirection: 'row',
          alignItems: 'flex-start'
        }
      }}>
        <motion.div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '1rem',
            '@media (min-width: 768px)': {
              alignItems: 'flex-start',
              marginBottom: 0
            }
          }}
          variants={itemVariants}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--color-gray-dark)'
            }} className="dark-text">{name}, {country}</h2>
            <motion.button
              onClick={toggleUnits}
              style={{
                marginLeft: '0.5rem',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                backgroundColor: '#dbeafe',
                color: 'var(--color-primary-dark)',
                borderRadius: '0.25rem'
              }}
              whileHover={{
                scale: 1.05,
                backgroundColor: '#bfdbfe'
              }}
              whileTap={{ scale: 0.95 }}
            >
              {units === 'metric' ? '°C → °F' : '°F → °C'}
            </motion.button>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-gray)' }}>{formatDate(dt)}</p>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
            <motion.div
              style={{
                position: 'relative',
                width: '5.5rem',
                height: '5.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(67, 97, 238, 0.15) 0%, rgba(67, 97, 238, 0) 70%)',
                  filter: 'blur(8px)'
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
              <motion.img
                src={iconUrl}
                alt={weatherDescription}
                style={{
                  width: '5rem',
                  height: '5rem',
                  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                  y: [0, -5, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
            </motion.div>
            <div style={{ marginLeft: '1rem' }}>
              <motion.div
                style={{
                  position: 'relative',
                  display: 'inline-block'
                }}
              >
                <motion.h1
                  style={{
                    fontSize: '3.5rem',
                    fontWeight: 'bold',
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 10px rgba(67, 97, 238, 0.2)',
                    marginBottom: '0.25rem'
                  }}
                  animate={{
                    scale: [1, 1.03, 1],
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    scale: {
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    },
                    backgroundPosition: {
                      duration: 5,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }
                  }}
                >
                  {formatTemperature(temp, units)}
                </motion.h1>
                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: '-5px',
                    left: '0',
                    width: '100%',
                    height: '2px',
                    background: 'var(--gradient-primary)',
                    borderRadius: '2px',
                    opacity: 0.7
                  }}
                  animate={{
                    width: ['0%', '100%', '0%'],
                    left: ['0%', '0%', '100%']
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                />
              </motion.div>
              <motion.p
                style={{
                  color: 'var(--color-gray-dark)',
                  textTransform: 'capitalize',
                  fontWeight: '500',
                  fontSize: '1.1rem',
                  marginTop: '0.5rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
                className="dark-text-secondary"
                animate={{
                  x: [0, 5, 0],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                  marginRight: '0.5rem'
                }}></span>
                {weatherDescription}
              </motion.p>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem'
          }}
          variants={itemVariants}
        >
          <motion.div
            style={weatherInfoStyle}
            className="dark-bg-secondary"
            whileHover={{
              scale: 1.05,
              boxShadow: 'var(--shadow-md)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(239, 246, 255, 0.9))'
            }}
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              <ThermometerIcon size={28} color="var(--color-primary)" />
            </motion.div>
            <span style={labelStyle}>Feels Like</span>
            <motion.span
              style={valueStyle}
              className="dark-text"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {formatTemperature(feels_like, units)}
            </motion.span>
          </motion.div>

          <motion.div
            style={weatherInfoStyle}
            className="dark-bg-secondary"
            whileHover={{
              scale: 1.05,
              boxShadow: 'var(--shadow-md)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(239, 246, 255, 0.9))'
            }}
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: 0.2
              }}
            >
              <DropletIcon size={28} color="var(--color-secondary)" />
            </motion.div>
            <span style={labelStyle}>Humidity</span>
            <motion.span
              style={valueStyle}
              className="dark-text"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            >
              {humidity}%
            </motion.span>
          </motion.div>

          <motion.div
            style={weatherInfoStyle}
            className="dark-bg-secondary"
            whileHover={{
              scale: 1.05,
              boxShadow: 'var(--shadow-md)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(239, 246, 255, 0.9))'
            }}
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: 0.4
              }}
            >
              <WindIcon size={28} color="var(--color-primary-dark)" />
            </motion.div>
            <span style={labelStyle}>Wind</span>
            <motion.span
              style={valueStyle}
              className="dark-text"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            >
              {wind.speed} {units === 'metric' ? 'm/s' : 'mph'} {windDirection}
            </motion.span>
          </motion.div>

          <motion.div
            style={weatherInfoStyle}
            className="dark-bg-secondary"
            whileHover={{
              scale: 1.05,
              boxShadow: 'var(--shadow-md)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(239, 246, 255, 0.9))'
            }}
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: 0.6
              }}
            >
              <PressureIcon size={28} color="var(--color-accent)" />
            </motion.div>
            <span style={labelStyle}>Pressure</span>
            <motion.span
              style={valueStyle}
              className="dark-text"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            >
              {pressure} hPa
            </motion.span>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(229, 231, 235, 0.5)',
          position: 'relative',
          overflow: 'hidden'
        }}
        className="dark-border"
        variants={itemVariants}
      >
        <motion.div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '1px',
            background: 'var(--gradient-primary)',
            opacity: 0.5
          }}
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        <motion.div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            transition: 'all 0.3s ease'
          }}
          whileHover={{
            scale: 1.05,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <motion.div
            animate={{
              y: [0, -5, 0],
              rotate: [0, 10, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          >
            <SunriseIcon size={28} color="var(--color-warning)" />
          </motion.div>
          <span style={{
            ...labelStyle,
            fontWeight: '600',
            color: 'var(--color-primary)'
          }}>Sunrise</span>
          <motion.span
            style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'var(--color-gray-dark)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
            className="dark-text"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {formatDate(sunrise, 'time')}
          </motion.span>
        </motion.div>

        <motion.div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            transition: 'all 0.3s ease'
          }}
          whileHover={{
            scale: 1.05,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <motion.div
            animate={{
              y: [0, -5, 0],
              rotate: [0, -10, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 0.5
            }}
          >
            <SunsetIcon size={28} color="var(--color-accent)" />
          </motion.div>
          <span style={{
            ...labelStyle,
            fontWeight: '600',
            color: 'var(--color-primary)'
          }}>Sunset</span>
          <motion.span
            style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: 'var(--color-gray-dark)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
            className="dark-text"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            {formatDate(sunset, 'time')}
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CurrentWeather;
