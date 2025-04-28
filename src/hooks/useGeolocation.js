import { useEffect, useState } from 'react';

/**
 * Custom hook for getting user's geolocation
 * @returns {Object} - Geolocation data and status
 */
const useGeolocation = () => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: null, lng: null },
    error: null
  });

  const onSuccess = (position) => {
    console.log("Geolocation success:", position.coords);
    setLocation({
      loaded: true,
      coordinates: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      },
      error: null
    });
  };

  const onError = (error) => {
    console.error("Geolocation error:", error);

    let errorMessage = "Unable to get your location. ";

    switch(error.code) {
      case error.PERMISSION_DENIED:
        errorMessage += "You denied the request for geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage += "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        errorMessage += "The request to get your location timed out.";
        break;
      default:
        errorMessage += "An unknown error occurred.";
    }

    console.warn(errorMessage);

    setLocation({
      loaded: true,
      coordinates: { lat: null, lng: null },
      error: {
        code: error.code,
        message: errorMessage
      }
    });
  };

  useEffect(() => {
    console.log("Initializing geolocation hook");

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      setLocation({
        loaded: true,
        coordinates: { lat: null, lng: null },
        error: {
          code: 0,
          message: "Geolocation not supported by your browser"
        }
      });
      return;
    }

    // Set a timeout in case geolocation takes too long
    const timeoutId = setTimeout(() => {
      console.warn("Geolocation request timed out");
      setLocation({
        loaded: true,
        coordinates: { lat: null, lng: null },
        error: {
          code: 3, // Timeout
          message: "Geolocation request timed out"
        }
      });
    }, 15000); // 15 seconds timeout

    try {
      console.log("Requesting geolocation...");

      // Request geolocation
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          onSuccess(position);
        },
        (error) => {
          clearTimeout(timeoutId);
          onError(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Exception during geolocation request:", err);

      setLocation({
        loaded: true,
        coordinates: { lat: null, lng: null },
        error: {
          code: -1,
          message: "Exception during geolocation request: " + err.message
        }
      });
    }

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return location;
};

export default useGeolocation;
