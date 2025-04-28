import React from 'react';
import { motion } from 'framer-motion';
import { ThermometerIcon } from './WeatherIcons';

// Animated temperature component with visual thermometer
export const AnimatedTemperature = ({ temperature, units, size = 'large' }) => {
  // Calculate temperature percentage for visual representation
  // Assuming range from -30 to 50 degrees Celsius
  const minTemp = -30;
  const maxTemp = 50;
  const tempValue = parseFloat(temperature);
  const percentage = Math.min(Math.max(((tempValue - minTemp) / (maxTemp - minTemp)) * 100, 0), 100);
  
  // Determine color based on temperature
  const getColor = () => {
    if (tempValue < 0) return '#00bcd4'; // Cold blue
    if (tempValue < 10) return '#4fc3f7'; // Cool light blue
    if (tempValue < 20) return '#8bc34a'; // Mild green
    if (tempValue < 30) return '#ffc107'; // Warm yellow
    if (tempValue < 40) return '#ff9800'; // Hot orange
    return '#f44336'; // Very hot red
  };
  
  // Size configurations
  const dimensions = {
    small: {
      width: 30,
      height: 60,
      fontSize: '1rem',
      iconSize: 16
    },
    medium: {
      width: 40,
      height: 80,
      fontSize: '1.5rem',
      iconSize: 24
    },
    large: {
      width: 50,
      height: 100,
      fontSize: '2rem',
      iconSize: 32
    }
  };
  
  const { width, height, fontSize, iconSize } = dimensions[size] || dimensions.medium;
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.5rem'
    }}>
      <motion.div
        style={{
          position: 'relative',
          width,
          height,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: height / 2,
          overflow: 'hidden',
          border: '2px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 0 10px rgba(255, 255, 255, 0.2)',
          marginBottom: '0.5rem'
        }}
      >
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: getColor(),
            borderRadius: width / 2,
            boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.5)'
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: width * 0.6,
            height: width * 0.6,
            borderRadius: '50%',
            backgroundColor: getColor(),
            boxShadow: `0 0 10px ${getColor()}`
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      <motion.div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize,
          fontWeight: 'bold',
          color: getColor(),
          textShadow: `0 0 5px ${getColor()}40`
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {temperature}°{units === 'metric' ? 'C' : 'F'}
      </motion.div>
    </div>
  );
};

// Animated temperature card with effects
export const TemperatureCard = ({ current, feelsLike, high, low, units }) => {
  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '300px'
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '1rem',
        width: '100%'
      }}>
        <AnimatedTemperature temperature={current} units={units} size="large" />
        
        <div style={{ 
          marginLeft: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          <div style={{ 
            fontSize: '0.875rem', 
            color: 'var(--color-gray)',
            marginBottom: '0.5rem'
          }}>
            Feels like: <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{feelsLike}°{units === 'metric' ? 'C' : 'F'}</span>
          </div>
          
          {high && low && (
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.875rem',
              color: 'var(--color-gray)'
            }}>
              <span style={{ 
                color: '#f44336', 
                marginRight: '0.5rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M19 12l-7-7-7 7"/>
                </svg>
                {high}°
              </span>
              <span style={{ 
                color: '#2196f3',
                display: 'flex',
                alignItems: 'center'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19V5M5 12l7 7 7-7"/>
                </svg>
                {low}°
              </span>
            </div>
          )}
        </div>
      </div>
      
      <motion.div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '0.5rem',
          borderRadius: '0.5rem',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          color: 'var(--color-gray)'
        }}
        animate={{
          backgroundColor: ['rgba(0, 0, 0, 0.05)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.05)']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <ThermometerIcon size={16} color="var(--color-primary)" />
        <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}>
          Temperature updated just now
        </span>
      </motion.div>
    </motion.div>
  );
};

// Temperature trend chart with animation
export const TemperatureTrend = ({ hourlyData, units }) => {
  // Extract temperature data for the chart
  const temperatures = hourlyData.map(item => item.main.temp);
  const times = hourlyData.map(item => {
    const date = new Date(item.dt * 1000);
    return date.getHours() + ':00';
  });
  
  // Find min and max for scaling
  const minTemp = Math.min(...temperatures) - 2;
  const maxTemp = Math.max(...temperatures) + 2;
  
  // Calculate positions for the chart
  const getY = (temp) => {
    return 100 - ((temp - minTemp) / (maxTemp - minTemp) * 100);
  };
  
  // Generate path for the chart
  const generatePath = () => {
    if (temperatures.length === 0) return '';
    
    const points = temperatures.map((temp, i) => {
      const x = (i / (temperatures.length - 1)) * 100;
      const y = getY(temp);
      return `${x},${y}`;
    });
    
    return `M${points.join(' L')}`;
  };
  
  return (
    <motion.div
      style={{
        width: '100%',
        height: '150px',
        padding: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        marginTop: '1rem'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ 
        fontSize: '0.875rem', 
        fontWeight: 'bold',
        marginBottom: '0.5rem',
        color: 'var(--color-gray-dark)'
      }} className="dark-text">
        Temperature Trend
      </div>
      
      <div style={{ 
        position: 'relative',
        width: '100%',
        height: '100px'
      }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          <line x1="0" y1="100" x2="100" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          
          {/* Temperature path */}
          <motion.path
            d={generatePath()}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          
          {/* Temperature points */}
          {temperatures.map((temp, i) => (
            <motion.circle
              key={i}
              cx={(i / (temperatures.length - 1)) * 100}
              cy={getY(temp)}
              r="2"
              fill="white"
              stroke="var(--color-primary)"
              strokeWidth="1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 + (i * 0.1), duration: 0.3 }}
            />
          ))}
          
          {/* Temperature labels */}
          {temperatures.map((temp, i) => (
            <motion.text
              key={`label-${i}`}
              x={(i / (temperatures.length - 1)) * 100}
              y={getY(temp) - 5}
              fontSize="6"
              textAnchor="middle"
              fill="var(--color-primary)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 + (i * 0.1), duration: 0.3 }}
            >
              {Math.round(temp)}°
            </motion.text>
          ))}
        </svg>
        
        {/* Time labels */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: '0.25rem',
          fontSize: '0.7rem',
          color: 'var(--color-gray)'
        }}>
          {times.map((time, i) => (
            <motion.div
              key={`time-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 + (i * 0.1), duration: 0.3 }}
            >
              {time}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
