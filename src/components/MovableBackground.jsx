import { motion, useMotionValue, useTransform } from 'framer-motion';
import React, { useEffect, useState } from 'react';

// Interactive background that responds to mouse movement
export const MovableBackground = ({ condition = 'clear', darkMode = false }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Motion values for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Update mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });

      // Update motion values with some damping for smoother effect
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Set initial window size
    handleResize();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [mouseX, mouseY]);

  // Get background colors based on weather and time with enhanced color palette
  const getBackgroundColors = () => {
    if (darkMode) {
      switch(condition) {
        case 'clear':
          return ['#0F172A', '#3A0CA3']; // Deep blue night sky with purple accent
        case 'clouds':
          return ['#1F2937', '#4361EE']; // Cloudy night with blue accent
        case 'rain':
          return ['#1E3A8A', '#4CC9F0']; // Rainy night with cyan accent
        case 'snow':
          return ['#1F2937', '#7B9FFF']; // Snowy night with light blue accent
        default:
          return ['#0F172A', '#3A0CA3'];
      }
    } else {
      switch(condition) {
        case 'clear':
          return ['#4361EE', '#4CC9F0']; // Sunny day with gradient
        case 'clouds':
          return ['#4CC9F0', '#7B9FFF']; // Cloudy day with light blue gradient
        case 'rain':
          return ['#3A0CA3', '#4361EE']; // Rainy day with purple-blue gradient
        case 'snow':
          return ['#7B9FFF', '#F3F4F6']; // Snowy day with light gradient
        default:
          return ['#4361EE', '#4CC9F0'];
      }
    }
  };

  const [color1, color2] = getBackgroundColors();

  // Transform mouse position to background movement
  const backgroundX = useTransform(mouseX, [0, windowSize.width], [10, -10]);
  const backgroundY = useTransform(mouseY, [0, windowSize.height], [10, -10]);

  // Generate particles based on weather condition
  const generateParticles = () => {
    const count = condition === 'clear' ? 15 :
                 condition === 'clouds' ? 20 :
                 condition === 'rain' ? 30 :
                 condition === 'snow' ? 40 : 20;

    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 20 + 5;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 10 + 10;

      let color, shape;

      switch(condition) {
        case 'clouds':
          color = darkMode ? '#7B9FFF' : '#F9FAFB';
          shape = 'circle';
          break;
        case 'rain':
          color = darkMode ? '#4CC9F0' : '#4361EE';
          shape = 'line';
          break;
        case 'snow':
          color = darkMode ? '#F9FAFB' : '#F9FAFB';
          shape = 'star';
          break;
        case 'clear':
        default:
          color = darkMode ? '#3A0CA3' : '#F72585';
          shape = 'circle';
      }

      return { id: i, size, color, x, y, delay, duration, shape };
    });
  };

  const particles = generateParticles();

  // Transform for parallax layers
  const layer1X = useTransform(mouseX, [0, windowSize.width], [-15, 15]);
  const layer1Y = useTransform(mouseY, [0, windowSize.height], [-15, 15]);

  const layer2X = useTransform(mouseX, [0, windowSize.width], [-30, 30]);
  const layer2Y = useTransform(mouseY, [0, windowSize.height], [-30, 30]);

  const layer3X = useTransform(mouseX, [0, windowSize.width], [15, -15]);
  const layer3Y = useTransform(mouseY, [0, windowSize.height], [15, -15]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: -1
    }}>
      {/* Base gradient background */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(to bottom, ${color1}, ${color2})`,
          x: backgroundX,
          y: backgroundY
        }}
        transition={{ type: 'spring', damping: 50 }}
      />

      {/* Parallax Layer 1 */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          x: layer1X,
          y: layer1Y
        }}
        transition={{ type: 'spring', damping: 40 }}
      >
        {particles.slice(0, particles.length / 3).map(particle => (
          <ParticleElement key={`layer1-${particle.id}`} {...particle} />
        ))}
      </motion.div>

      {/* Parallax Layer 2 */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          x: layer2X,
          y: layer2Y
        }}
        transition={{ type: 'spring', damping: 30 }}
      >
        {particles.slice(particles.length / 3, 2 * particles.length / 3).map(particle => (
          <ParticleElement key={`layer2-${particle.id}`} {...particle} />
        ))}
      </motion.div>

      {/* Parallax Layer 3 */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          x: layer3X,
          y: layer3Y
        }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {particles.slice(2 * particles.length / 3).map(particle => (
          <ParticleElement key={`layer3-${particle.id}`} {...particle} />
        ))}
      </motion.div>

      {/* Weather-specific effects */}
      {condition === 'rain' && <RainEffect darkMode={darkMode} mouseX={mouseX} mouseY={mouseY} />}
      {condition === 'snow' && <SnowEffect darkMode={darkMode} mouseX={mouseX} mouseY={mouseY} />}
      {condition === 'clear' && <SunEffect darkMode={darkMode} mouseX={mouseX} mouseY={mouseY} />}
      {condition === 'clouds' && <CloudEffect darkMode={darkMode} mouseX={mouseX} mouseY={mouseY} />}

      {/* Interactive glow effect that follows cursor */}
      <motion.div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: darkMode
            ? 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)',
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
          pointerEvents: 'none',
          zIndex: 0,
          filter: 'blur(10px)'
        }}
        transition={{ type: 'spring', damping: 30 }}
      />
    </div>
  );
};

// Particle element with different shapes
const ParticleElement = ({ size, color, x, y, delay, duration, shape }) => {
  const getShapeStyle = () => {
    switch(shape) {
      case 'line':
        return {
          width: '2px',
          height: size * 3,
          borderRadius: '0',
          transform: 'rotate(15deg)'
        };
      case 'star':
        return {
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          borderRadius: '0'
        };
      case 'circle':
      default:
        return { borderRadius: '50%' };
    }
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        backgroundColor: color,
        opacity: 0.5,
        top: `${y}%`,
        left: `${x}%`,
        ...getShapeStyle()
      }}
      animate={{
        y: ['0%', '100%'],
        opacity: [0.2, 0.5, 0.2],
        scale: [1, 1.2, 1]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};

// Rain effect
const RainEffect = ({ darkMode, mouseX, mouseY }) => {
  const count = 50;
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;

  // Transform for parallax effect
  const rainX = useTransform(mouseX, [0, windowWidth], [20, -20]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        x: rainX
      }}
      transition={{ type: 'spring', damping: 50 }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const x = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = Math.random() * 0.5 + 0.7;
        const width = Math.random() * 1 + 1;
        const height = Math.random() * 20 + 10;

        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width,
              height,
              backgroundColor: darkMode ? '#4CC9F0' : '#4361EE',
              opacity: 0.7,
              top: -height,
              left: `${x}%`,
              borderRadius: '2px'
            }}
            animate={{
              y: ['0vh', '100vh'],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
      })}
    </motion.div>
  );
};

// Snow effect
const SnowEffect = ({ darkMode, mouseX, mouseY }) => {
  const count = 40;
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;

  // Transform for parallax effect
  const snowX = useTransform(mouseX, [0, windowWidth], [30, -30]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        x: snowX
      }}
      transition={{ type: 'spring', damping: 40 }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const x = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = Math.random() * 5 + 10;
        const size = Math.random() * 8 + 2;

        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              backgroundColor: 'white',
              opacity: 0.8,
              top: -size,
              left: `${x}%`,
              borderRadius: '50%',
              filter: 'blur(1px)'
            }}
            animate={{
              y: ['0vh', '100vh'],
              x: [0, Math.random() * 100 - 50],
              rotate: [0, 360],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
      })}
    </motion.div>
  );
};

// Sun effect
const SunEffect = ({ darkMode, mouseX, mouseY }) => {
  if (darkMode) return null;

  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  // Transform for parallax effect
  const sunX = useTransform(mouseX, [0, windowWidth], [-50, 50]);
  const sunY = useTransform(mouseY, [0, windowHeight], [-30, 30]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(247,37,133,0.8) 0%, rgba(247,37,133,0.3) 50%, transparent 70%)',
        filter: 'blur(10px)',
        top: '10%',
        right: '10%',
        x: sunX,
        y: sunY
      }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.7, 0.9, 0.7]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: "easeInOut"
      }}
    >
      {/* Sun rays */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '300px',
            height: '3px',
            background: 'linear-gradient(90deg, rgba(247,37,133,0.7), transparent)',
            top: '50%',
            left: '50%',
            transformOrigin: 'left center',
            transform: `rotate(${i * 30}deg)`,
            filter: 'blur(2px)'
          }}
          animate={{
            scaleX: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 3,
            delay: i * 0.2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  );
};

// Cloud effect
const CloudEffect = ({ darkMode, mouseX, mouseY }) => {
  const count = 6;
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;

  // Transform for parallax effect
  const cloudX = useTransform(mouseX, [0, windowWidth], [40, -40]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        x: cloudX
      }}
      transition={{ type: 'spring', damping: 30 }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const x = (i * 20) % 100;
        const y = 10 + (i * 15) % 50;
        const delay = i * 0.5;
        const duration = 30 + i * 5;
        const size = 100 + i * 30;

        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: size,
              height: size * 0.6,
              backgroundColor: darkMode ? 'rgba(67, 97, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)',
              borderRadius: '50%',
              filter: 'blur(15px)',
              top: `${y}%`,
              left: `${x - 20}%`
            }}
            animate={{
              x: ['0%', '100%'],
              scale: [1, 1.1, 0.9, 1],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: "linear"
            }}
          />
        );
      })}
    </motion.div>
  );
};
