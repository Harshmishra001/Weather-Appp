import React from 'react';
import { motion } from 'framer-motion';

// Animated cloud component
export const AnimatedCloud = ({ size = 100, x = 0, y = 0, delay = 0, duration = 20 }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: size,
        height: size * 0.6,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.4)',
        top: y,
        left: x,
        zIndex: 0,
        filter: 'blur(5px)'
      }}
      initial={{ x: -size }}
      animate={{ x: `calc(100vw + ${size}px)` }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'linear'
      }}
    />
  );
};

// Animated sun component
export const AnimatedSun = () => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: 'rgba(255, 204, 0, 0.8)',
        top: '10%',
        right: '10%',
        zIndex: 0,
        boxShadow: '0 0 70px rgba(255, 204, 0, 0.6)'
      }}
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );
};

// Animated rain drop component
export const AnimatedRainDrop = ({ x = 0, delay = 0, duration = 1.5 }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: 2,
        height: 20,
        background: 'rgba(255, 255, 255, 0.6)',
        top: -20,
        left: x,
        zIndex: 0
      }}
      animate={{ y: '100vh' }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'linear'
      }}
    />
  );
};

// Animated snowflake component
export const AnimatedSnowflake = ({ size = 8, x = 0, delay = 0, duration = 10 }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.8)',
        top: -size,
        left: x,
        zIndex: 0
      }}
      animate={{ 
        y: '100vh',
        x: [x - 20, x + 20, x - 10, x + 10, x]
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'linear'
      }}
    />
  );
};

// Weather background component that renders different animations based on weather condition
export const WeatherBackground = ({ condition = 'clear', darkMode = false }) => {
  // Generate random positions for elements
  const generateRandomPositions = (count, maxWidth) => {
    return Array.from({ length: count }, () => Math.random() * maxWidth);
  };

  const cloudPositions = generateRandomPositions(5, 100);
  const rainPositions = generateRandomPositions(50, 100);
  const snowPositions = generateRandomPositions(30, 100);

  // Render different backgrounds based on weather condition
  const renderWeatherElements = () => {
    switch (condition.toLowerCase()) {
      case 'clouds':
      case 'cloudy':
        return (
          <>
            {cloudPositions.map((pos, index) => (
              <AnimatedCloud 
                key={index} 
                size={100 + Math.random() * 100} 
                x={pos + '%'} 
                y={10 + Math.random() * 30 + '%'} 
                delay={index * 2} 
                duration={15 + Math.random() * 10}
              />
            ))}
          </>
        );
      case 'rain':
      case 'drizzle':
        return (
          <>
            <AnimatedCloud size={150} x="10%" y="10%" delay={0} duration={25} />
            <AnimatedCloud size={200} x="40%" y="15%" delay={2} duration={30} />
            <AnimatedCloud size={180} x="70%" y="5%" delay={4} duration={28} />
            {rainPositions.map((pos, index) => (
              <AnimatedRainDrop 
                key={index} 
                x={pos + '%'} 
                delay={Math.random() * 3} 
                duration={1 + Math.random()}
              />
            ))}
          </>
        );
      case 'snow':
        return (
          <>
            <AnimatedCloud size={150} x="10%" y="10%" delay={0} duration={25} />
            <AnimatedCloud size={200} x="40%" y="15%" delay={2} duration={30} />
            {snowPositions.map((pos, index) => (
              <AnimatedSnowflake 
                key={index} 
                size={4 + Math.random() * 8} 
                x={pos + '%'} 
                delay={Math.random() * 5} 
                duration={8 + Math.random() * 7}
              />
            ))}
          </>
        );
      case 'clear':
      default:
        return (
          <>
            <AnimatedSun />
            <AnimatedCloud size={80} x="20%" y="20%" delay={0} duration={35} />
            <AnimatedCloud size={60} x="60%" y="15%" delay={5} duration={40} />
          </>
        );
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: -1,
        background: darkMode 
          ? 'linear-gradient(to bottom, #1a202c, #2d3748)' 
          : 'linear-gradient(to bottom, #87CEEB, #e0f7fa)'
      }}
    >
      {renderWeatherElements()}
    </div>
  );
};

// Animated floating icons
export const FloatingIcon = ({ icon, size = 24, x = 0, y = 0, duration = 3 }) => {
  const Icon = icon;
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: y,
        left: x,
        opacity: 0.3
      }}
      animate={{ 
        y: [y - 10, y + 10, y - 5, y + 5, y],
        rotate: [0, 5, -5, 3, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      <Icon size={size} />
    </motion.div>
  );
};

// Animated gradient background
export const GradientBackground = ({ colors = ['#87CEEB', '#e0f7fa'], darkMode = false }) => {
  const darkColors = ['#1a202c', '#2d3748'];
  const activeColors = darkMode ? darkColors : colors;
  
  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `linear-gradient(to bottom, ${activeColors[0]}, ${activeColors[1]})`,
        zIndex: -2
      }}
      animate={{
        background: [
          `linear-gradient(to bottom, ${activeColors[0]}, ${activeColors[1]})`,
          `linear-gradient(to bottom right, ${activeColors[0]}, ${activeColors[1]})`,
          `linear-gradient(to right, ${activeColors[0]}, ${activeColors[1]})`,
          `linear-gradient(to top right, ${activeColors[0]}, ${activeColors[1]})`,
          `linear-gradient(to bottom, ${activeColors[0]}, ${activeColors[1]})`
        ]
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
};
