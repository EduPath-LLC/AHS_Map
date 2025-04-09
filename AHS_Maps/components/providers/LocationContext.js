import React, { createContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { AppState } from 'react-native';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [hasPermission, setHasPermission] = useState(null); // null means not determined yet

  const checkPermissions = async () => {
    try {
      const { status } = await Location.getPermissionsAsync();
      setHasPermission(status === 'granted');
      return status === 'granted';
    } catch (error) {
      setErrorMsg('Error checking permissions');
      return false;
    }
  };

  const requestPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      if (granted) {
        await updateLocation();
      } else {
        setErrorMsg('Permission to access location was denied');
      }
      return granted;
    } catch (error) {
      setErrorMsg('Error requesting permissions');
      return false;
    }
  };

  const updateLocation = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      return true;
    } catch (error) {
      setErrorMsg('Error getting location');
      return false;
    }
  };

  useEffect(() => {
    // Initial permission check
    requestPermissions();

    // Set up app state listener to check permissions when app comes to foreground
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        await checkPermissions();
      }
    });

    // Set up location watcher if permissions are granted
    let locationSubscription;
    const setupLocationWatcher = async () => {
      if (hasPermission) {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (newLocation) => {
            setLocation(newLocation);
          }
        );
      }
    };

    setupLocationWatcher();

    return () => {
      subscription?.remove();
      locationSubscription?.remove();
    };
  }, [hasPermission]);

  return (
    <LocationContext.Provider value={{ 
      location, 
      errorMsg, 
      hasPermission, 
      requestPermissions,
      updateLocation 
    }}>
      {children}
    </LocationContext.Provider>
  );
};