import React, { useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

// Particle component for creating dynamic background effects
const Particle = ({ 
  size, 
  color, 
  x, 
  y, 
  delay, 
  duration, 
  blurAmount = 0,
  opacity = 0.5,
  shape = 'circle'
}) => {
  const getShapeStyle = () => {
    switch(shape) {
      case 'square':
        return { borderRadius: '2px' };
      case 'star':
        return { clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' };
      case 'triangle':
        return { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' };
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
        opacity,
        filter: `blur(${blurAmount}px)`,
        top: y,
        left: x,
        ...getShapeStyle()
      }}
      initial={{ scale: 0, rotate: 0 }}
      animate={{ 
        scale: [0, 1, 0.8, 1, 0],
        rotate: [0, 90, 180, 270, 360],
        x: [x, x + 20, x - 20, x + 10, x],
        y: [y, y - 30, y - 60, y - 90, y - 120]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

// Aurora effect component
const Aurora = ({ color, delay, duration, top, left, size }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}20 0%, ${color}10 40%, ${color}05 60%, transparent 70%)`,
        top,
        left,
        filter: 'blur(30px)',
        opacity: 0.7,
        zIndex: -1
      }}
      animate={{
        scale: [1, 1.2, 1.5, 1.2, 1],
        opacity: [0.4, 0.6, 0.8, 0.6, 0.4],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: "easeInOut"
      }}
    />
  );
};

// Wave component for water-like effects
const Wave = ({ color, y, amplitude, frequency, speed }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: '200%',
        height: '50px',
        left: '-50%',
        top: `calc(${y}% - 25px)`,
        background: `linear-gradient(to bottom, transparent, ${color}40, transparent)`,
        borderRadius: '50%',
        filter: 'blur(8px)',
        zIndex: -1
      }}
      animate={{
        scaleY: [1, amplitude, 1],
        x: ['0%', '25%', '50%', '75%', '100%']
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

// Animated stars for night sky
const StarField = ({ count = 50, darkMode }) => {
  if (!darkMode) return null;
  
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 3 + 2;
        
        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              backgroundColor: 'white',
              borderRadius: '50%',
              top: `${y}%`,
              left: `${x}%`,
              zIndex: -1
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
        );
      })}
    </>
  );
};

// Animated meteor
const Meteor = ({ darkMode }) => {
  const [active, setActive] = useState(false);
  
  useEffect(() => {
    if (!darkMode) return;
    
    const interval = setInterval(() => {
      setActive(true);
      setTimeout(() => setActive(false), 2000);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [darkMode]);
  
  if (!darkMode) return null;
  
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ 
            top: '-5%', 
            left: '110%',
            width: '2px',
            height: '2px',
            opacity: 0
          }}
          animate={{ 
            top: '70%', 
            left: '-10%',
            width: '3px',
            height: '3px',
            opacity: [0, 1, 0]
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            borderRadius: '50%',
            boxShadow: '0 0 20px 2px rgba(255, 255, 255, 0.5)',
            zIndex: -1
          }}
        >
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '2px',
              background: 'linear-gradient(to left, rgba(255,255,255,0.8), transparent)',
              transformOrigin: 'right center',
              transform: 'rotate(15deg)'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Northern lights effect
const NorthernLights = ({ darkMode }) => {
  if (!darkMode) return null;
  
  const colors = [
    '#26D0CE', // teal
    '#1A2980', // deep blue
    '#9D50BB', // purple
    '#6FB1FC', // light blue
    '#81FB8C'  // green
  ];
  
  return (
    <>
      {colors.map((color, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            width: '150%',
            height: '200px',
            left: '-25%',
            top: `${10 + index * 10}%`,
            background: `linear-gradient(90deg, transparent, ${color}30, ${color}40, ${color}30, transparent)`,
            filter: 'blur(30px)',
            zIndex: -1
          }}
          animate={{
            y: [0, 20, -20, 10, 0],
            skewX: [0, 2, -2, 1, 0],
            opacity: [0.3, 0.5, 0.7, 0.5, 0.3]
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  );
};

// Animated sun rays
const SunRays = ({ darkMode }) => {
  if (darkMode) return null;
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        top: '5%',
        right: '10%',
        background: 'radial-gradient(circle, rgba(255,204,0,0.4) 0%, rgba(255,204,0,0.1) 50%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(10px)',
        zIndex: -1
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.6, 0.8, 0.6]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: "easeInOut"
      }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '400px',
            height: '20px',
            top: '140px',
            left: '-50px',
            background: 'linear-gradient(90deg, transparent, rgba(255,204,0,0.3), transparent)',
            transformOrigin: 'center',
            transform: `rotate(${i * 30}deg)`,
            filter: 'blur(5px)'
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 4,
            delay: i * 0.3,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  );
};

// Enhanced animated background
export const EnhancedBackground = ({ condition = 'clear', darkMode = false }) => {
  const controls = useAnimation();
  const [particles, setParticles] = useState([]);
  
  // Generate particles based on weather condition
  useEffect(() => {
    const count = condition === 'clear' ? 15 : 
                 condition === 'clouds' ? 10 : 
                 condition === 'rain' ? 30 : 
                 condition === 'snow' ? 40 : 20;
                 
    const newParticles = Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 20 + 5;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 10 + 10;
      const blurAmount = Math.random() * 5;
      const opacity = Math.random() * 0.3 + 0.1;
      
      let color, shape;
      
      switch(condition) {
        case 'clouds':
          color = darkMode ? '#4B5563' : '#F9FAFB';
          shape = 'circle';
          break;
        case 'rain':
          color = darkMode ? '#1E40AF' : '#93C5FD';
          shape = Math.random() > 0.7 ? 'square' : 'circle';
          break;
        case 'snow':
          color = '#F9FAFB';
          shape = Math.random() > 0.5 ? 'star' : 'circle';
          break;
        case 'clear':
        default:
          color = darkMode ? '#4B5563' : '#FEF3C7';
          shape = Math.random() > 0.8 ? 'triangle' : 'circle';
      }
      
      return {
        id: i,
        size,
        color,
        x: `${x}%`,
        y: `${y}%`,
        delay,
        duration,
        blurAmount,
        opacity,
        shape
      };
    });
    
    setParticles(newParticles);
  }, [condition, darkMode]);
  
  // Get background colors based on weather and time
  const getBackgroundColors = () => {
    if (darkMode) {
      switch(condition) {
        case 'clear':
          return ['#0F172A', '#1E293B']; // Deep blue night sky
        case 'clouds':
          return ['#1F2937', '#374151']; // Cloudy night
        case 'rain':
          return ['#1E3A8A', '#1E40AF']; // Rainy night
        case 'snow':
          return ['#1F2937', '#312E81']; // Snowy night
        default:
          return ['#0F172A', '#1E293B'];
      }
    } else {
      switch(condition) {
        case 'clear':
          return ['#3B82F6', '#93C5FD']; // Sunny day
        case 'clouds':
          return ['#60A5FA', '#BFDBFE']; // Cloudy day
        case 'rain':
          return ['#64748B', '#94A3B8']; // Rainy day
        case 'snow':
          return ['#CBD5E1', '#E2E8F0']; // Snowy day
        default:
          return ['#3B82F6', '#93C5FD'];
      }
    }
  };
  
  const [color1, color2] = getBackgroundColors();
  
  // Get aurora colors based on condition
  const getAuroraColors = () => {
    if (darkMode) {
      return ['#6366F1', '#8B5CF6', '#EC4899', '#3B82F6', '#10B981'];
    } else {
      return ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'];
    }
  };
  
  const auroraColors = getAuroraColors();
  
  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: -1,
        background: `linear-gradient(to bottom, ${color1}, ${color2})`,
      }}
      animate={{
        background: [
          `linear-gradient(to bottom, ${color1}, ${color2})`,
          `linear-gradient(to bottom right, ${color1}, ${color2})`,
          `linear-gradient(to right, ${color1}, ${color2})`,
          `linear-gradient(to top right, ${color1}, ${color2})`,
          `linear-gradient(to bottom, ${color1}, ${color2})`
        ]
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      {/* Dynamic particles */}
      {particles.map(particle => (
        <Particle key={particle.id} {...particle} />
      ))}
      
      {/* Aurora effects */}
      {auroraColors.map((color, i) => (
        <Aurora 
          key={i}
          color={color}
          delay={i * 2}
          duration={10 + i * 2}
          top={`${20 + i * 10}%`}
          left={`${10 + i * 15}%`}
          size={300 + i * 50}
        />
      ))}
      
      {/* Wave effects for water-like motion */}
      {condition === 'rain' && (
        <>
          <Wave color="#60A5FA" y={30} amplitude={1.2} frequency={0.5} speed={15} />
          <Wave color="#3B82F6" y={50} amplitude={1.5} frequency={0.3} speed={20} />
          <Wave color="#2563EB" y={70} amplitude={1.3} frequency={0.4} speed={18} />
        </>
      )}
      
      {/* Star field for night mode */}
      <StarField count={100} darkMode={darkMode} />
      
      {/* Meteor effect for night mode */}
      <Meteor darkMode={darkMode} />
      
      {/* Northern lights effect for night mode */}
      {condition === 'clear' && <NorthernLights darkMode={darkMode} />}
      
      {/* Sun rays for day mode */}
      {condition === 'clear' && <SunRays darkMode={darkMode} />}
    </motion.div>
  );
};
