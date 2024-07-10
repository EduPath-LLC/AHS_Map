import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { 
  View,  
  TextInput, 
  Text, 
  TouchableOpacity,
  Keyboard
} from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { LocationContext } from '../components/providers/LocationContext';
import { MaterialIcons } from '@expo/vector-icons';

import { styles } from '../styles/light/MapLight'


const polylineCoordinates = [
  { latitude: 33.148972, longitude: -96.695055, reference: 'A' },
  { latitude: 33.151361, longitude: -96.695055, reference: 'B' },
 
  { latitude: 33.151417, longitude: -96.691777, reference: 'C' },
  { latitude: 33.149250, longitude: -96.691777, reference: 'D' },
  { latitude: 33.149222, longitude: -96.692694, reference: 'E' },
  { latitude: 33.148944, longitude: -96.692694, reference: 'F' },
  { latitude: 33.148972, longitude: -96.695055, reference: 'G' },
];

// Adjust overlapping segments
const offsetFactor = 0.00001; // Adjust this value to increase or decrease the offset

polylineCoordinates[2].latitude += offsetFactor;
polylineCoordinates[2].longitude += offsetFactor;

polylineCoordinates[3].latitude -= offsetFactor;
polylineCoordinates[3].longitude -= offsetFactor;

polylineCoordinates[4].latitude += offsetFactor;
polylineCoordinates[4].longitude += offsetFactor;

function distance(point1, point2) {
  const dx = point1.longitude - point2.longitude;
  const dy = point1.latitude - point2.latitude;
  return Math.sqrt(dx * dx + dy * dy);
}

function findNearestPointOnPolyline(point) {
  let minDistance = Infinity;
  let nearestPoint = null;
  let segmentIndex = -1;

  for (let i = 0; i < polylineCoordinates.length; i++) {
    const start = polylineCoordinates[i];
    const end = polylineCoordinates[(i + 1) % polylineCoordinates.length];
    const nearest = nearestPointOnLineSegment(point, start, end);
    const dist = distance(point, nearest);

    if (dist < minDistance) {
      minDistance = dist;
      nearestPoint = nearest;
      segmentIndex = i;
    }
  }

  return { point: nearestPoint, segmentIndex };
}
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
function nearestPointOnLineSegment(point, start, end) {
  const dx = end.longitude - start.longitude;
  const dy = end.latitude - start.latitude;
  const t = ((point.longitude - start.longitude) * dx + (point.latitude - start.latitude) * dy) / (dx * dx + dy * dy);
  
  if (t < 0) return start;
  if (t > 1) return end;

  return {
    latitude: start.latitude + t * dy,
    longitude: start.longitude + t * dx,
    reference: 'N' // N for Nearest
  };
}

function dijkstra(graph, start, end) {
  const costs = {};
  const parents = {};
  const processed = new Set();

  Object.keys(graph).forEach(node => {
    costs[node] = node === start ? 0 : Infinity;
  });

  let node = findLowestCostNode(costs, processed);

  while (node) {
    const cost = costs[node];
    const neighbors = graph[node];

    for (let n in neighbors) {
      const newCost = cost + neighbors[n];
      if (newCost < costs[n]) {
        costs[n] = newCost;
        parents[n] = node;
      }
    }

    processed.add(node);
    node = findLowestCostNode(costs, processed);
  }

  const path = [end];
  let parent = parents[end];
  while (parent) {
    path.push(parent);
    parent = parents[parent];
  }

  return path.reverse();
}

function findLowestCostNode(costs, processed) {
  return Object.keys(costs).reduce((lowest, node) => {
    if (lowest === null || costs[node] < costs[lowest]) {
      if (!processed.has(node)) {
        lowest = node;
      }
    }
    return lowest;
  }, null);
}
function calculateTotalDistance(routeCoordinates) {
  let totalDistance = 0;
  for (let i = 0; i < routeCoordinates.length - 1; i++) {
    totalDistance += calculateDistance(
      routeCoordinates[i].latitude,
      routeCoordinates[i].longitude,
      routeCoordinates[i + 1].latitude,
      routeCoordinates[i + 1].longitude
    );
  }
  return totalDistance;
}
function calculateBearing(start, end) {
  const startLat = start.latitude * Math.PI / 180;
  const startLng = start.longitude * Math.PI / 180;
  const endLat = end.latitude * Math.PI / 180;
  const endLng = end.longitude * Math.PI / 180;

  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) -
            Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);

  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360; // Normalize to 0-360
}
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}
function checkDistanceToPolyline(userLocation) {
  if (!userLocation) return;

  const { point: nearestPoint } = findNearestPointOnPolyline(userLocation);
  const distanceToPolyline = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    nearestPoint.latitude,
    nearestPoint.longitude
  );

  setIsMapDisabled(distanceToPolyline > 200);
}
function calculateRouteLengthInFeet(route) {
  let totalDistance = 0;
  for (let i = 0; i < route.length - 1; i++) {
    totalDistance += calculateDistance(
      route[i].latitude,
      route[i].longitude,
      route[i + 1].latitude,
      route[i + 1].longitude
    );
  }
  // Convert meters to feet and round to nearest 5
  return Math.round(totalDistance * 3.28084 / 5) * 5;
}
function calculateTurnDirection(currentBearing, nextBearing) {
  const angle = ((nextBearing - currentBearing + 360) % 360 + 360) % 360;
  if (angle > 315 || angle <= 45) return 'straight';
  if (angle > 45 && angle <= 135) return 'right';
  return 'left';
}

// Modify the findCurrentSegment function
function findCurrentSegment(location, route) {
  if (!location || !route || route.length < 2) {
    return { currentSegment: 0, progress: 0, currentBearing: 0, nextBearing: 0 };
  }

  let minDistance = Infinity;
  let currentSegment = 0;
  let progress = 0;

  for (let i = 0; i < route.length - 1; i++) {
    const start = route[i];
    const end = route[i + 1];
    if (!start || !end) continue;

    const nearest = nearestPointOnLineSegment(location, start, end);
    const dist = distance(location, nearest);

    if (dist < minDistance) {
      minDistance = dist;
      currentSegment = i;
      progress = distance(start, nearest) / distance(start, end);
    }
  }

  const currentBearing = calculateBearing(route[currentSegment], route[currentSegment + 1]);
  const nextBearing = currentSegment < route.length - 2 ? 
    calculateBearing(route[currentSegment + 1], route[currentSegment + 2]) : currentBearing;

  return { currentSegment, progress, currentBearing, nextBearing };
}

export default function Map() {
  const { location, errorMsg } = useContext(LocationContext);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const mapRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [route, setRoute] = useState([]);
  const [destination, setDestination] = useState(null);
  const [bearing, setBearing] = useState(0);
  const [isRouteActive, setIsRouteActive] = useState(false);
  const [showArrivedMessage, setShowArrivedMessage] = useState(false);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [hasArrived, setHasArrived] = useState(false);
  const [isMapDisabled, setIsMapDisabled] = useState(false);
  const [currentDirection, setCurrentDirection] = useState({ text: '', icon: null });
  const [remainingDistance, setRemainingDistance] = useState(0);
  

  const checkDistanceToPolyline = useCallback((userLocation) => {
    if (!userLocation) return;

    const { point: nearestPoint } = findNearestPointOnPolyline(userLocation);
    const distanceToPolyline = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      nearestPoint.latitude,
      nearestPoint.longitude
    );

    setIsMapDisabled(distanceToPolyline > 200);
  }, []);

  const calculateRoute = useCallback((start, end) => {
    const { point: startPoint, segmentIndex } = findNearestPointOnPolyline(start);
    
    const graph = {};
    
    for (let i = 0; i < polylineCoordinates.length; i++) {
      const point = polylineCoordinates[i];
      const nextPoint = polylineCoordinates[(i + 1) % polylineCoordinates.length];
      
      if (!graph[point.reference]) graph[point.reference] = {};
      if (!graph[nextPoint.reference]) graph[nextPoint.reference] = {};
      
      graph[point.reference][nextPoint.reference] = distance(point, nextPoint);
      graph[nextPoint.reference][point.reference] = distance(nextPoint, point);
    }
    
    graph[startPoint.reference] = {};
    graph[startPoint.reference][polylineCoordinates[segmentIndex].reference] = distance(startPoint, polylineCoordinates[segmentIndex]);
    graph[startPoint.reference][polylineCoordinates[(segmentIndex + 1) % polylineCoordinates.length].reference] = distance(startPoint, polylineCoordinates[(segmentIndex + 1) % polylineCoordinates.length]);
    
    graph[polylineCoordinates[segmentIndex].reference][startPoint.reference] = graph[startPoint.reference][polylineCoordinates[segmentIndex].reference];
    graph[polylineCoordinates[(segmentIndex + 1) % polylineCoordinates.length].reference][startPoint.reference] = graph[startPoint.reference][polylineCoordinates[(segmentIndex + 1) % polylineCoordinates.length].reference];

    const path = dijkstra(graph, startPoint.reference, end);
    
    const routeCoordinates = [startPoint];
    for (let i = 1; i < path.length; i++) {
      const currentRef = path[i];
      const currentPoint = polylineCoordinates.find(p => p.reference === currentRef) || startPoint;
      routeCoordinates.push(currentPoint);
    }

    return routeCoordinates;
  }, []);

  useEffect(() => {
    if (location) {
      checkDistanceToPolyline({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
  
      if (route.length > 1 && destinationCoords) {
        const { currentSegment, progress, currentBearing, nextBearing } = findCurrentSegment(
          { latitude: location.coords.latitude, longitude: location.coords.longitude },
          route
        );
  
        const currentSegmentDistance = calculateDistance(
          route[currentSegment].latitude,
          route[currentSegment].longitude,
          route[currentSegment + 1].latitude,
          route[currentSegment + 1].longitude
        );
        const remainingSegmentDistance = currentSegmentDistance * (1 - progress);
  
        const remainingDistanceInFeet = Math.round(remainingSegmentDistance * 3.28084 / 5) * 5;
        setRemainingDistance(remainingDistanceInFeet);
  
        if (currentSegment < route.length - 2) {
          const turnDirection = calculateTurnDirection(currentBearing, nextBearing);
          setCurrentDirection({
            text: `Turn ${turnDirection} in ${remainingDistanceInFeet} feet`,
            turn: turnDirection
          });
        } else if (currentSegment === route.length - 2) {
          setCurrentDirection({
            text: `Go straight for ${remainingDistanceInFeet} feet and you will arrive at your destination`,
            turn: null
          });
        }
  
        const remainingRoute = route.slice(currentSegment);
        const remainingDistance = calculateTotalDistance(remainingRoute);
        const totalRemainingDistanceInFeet = Math.round(Math.round(remainingDistance * 3.28084) / 5) * 5;
        const updatedEstimatedTime = Math.ceil(totalRemainingDistanceInFeet / 308);
        setEstimatedTime(updatedEstimatedTime);
  
        const distanceToDestination = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          destinationCoords.latitude,
          destinationCoords.longitude
        );
  
        if (distanceToDestination <= 10) {
          setHasArrived(true);
          setShowArrivedMessage(true);
          setRoute([]);
          setDestination(null);
          setBearing(0);
          setIsRouteActive(false);
          setEstimatedTime(0);
          setCurrentDirection({ text: '', turn: null });
          setSearchQuery('');
          setTimeout(() => setShowArrivedMessage(false), 3000);
        } else {
          if (currentSegment < route.length - 1) {
            const start = route[currentSegment];
            const end = route[currentSegment + 1];
  
            if (start && end) {
              const newBearing = calculateBearing(start, end);
              setBearing(newBearing);
            }
            
            animateCamera({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }, bearing);
          }
        }
      }
    }
  }, [location, route, destinationCoords, animateCamera, bearing, checkDistanceToPolyline]);
  
  useInterval(() => {
    if (location && mapRef.current && !isRouteActive) {
      mapRef.current.animateCamera({
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        heading: 0,
        pitch: 0,
        zoom: 18,
        altitude: 1000,
      }, { duration: 1000 });
    }
  }, 3000);
  
  // Modify the existing useInterval hook
  useInterval(() => {
    if (location && mapRef.current && isRouteActive) {
      mapRef.current.animateCamera({
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        heading: bearing,
        pitch: 0,
        zoom: 18,
        altitude: 1000,
      }, { duration: 1000 });
    }
  }, 3000);

  useInterval(() => {
    if (isRouteActive && !hasArrived) {
      performSearch();
    }
  }, 3000);
  
  const handleExitRoute = useCallback(() => {
    setRoute([]);
    setDestination(null);
    setBearing(0);
    setIsRouteActive(false);
    setSearchQuery(''); // Add this line to clear the search query
    setDestinationCoords(null);
  
    if (location) {
      animateCamera({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }, 0);
    }
  }, [location, animateCamera]);

  const performSearch = useCallback(() => {
    if (location && destination) {
      const newRoute = calculateRoute(
        { latitude: location.coords.latitude, longitude: location.coords.longitude },
        destination
      );
      setRoute(newRoute);
  
      if (newRoute.length > 1) {
        const { currentSegment } = findCurrentSegment(
          { latitude: location.coords.latitude, longitude: location.coords.longitude },
          newRoute
        );
  
        const start = newRoute[currentSegment];
        const end = newRoute[currentSegment + 1];
        if (start && end) {
          const newBearing = calculateBearing(start, end);
          setBearing(newBearing);
  
          const destPoint = newRoute[newRoute.length - 1];
          setDestinationCoords(destPoint);
  
          animateCamera({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }, newBearing);
  
          const remainingRoute = newRoute.slice(currentSegment);
          const remainingDistance = calculateTotalDistance(remainingRoute);
          const remainingDistanceInFeet = Math.round(Math.round(remainingDistance * 3.28084) / 5) * 5;
          const updatedEstimatedTime = Math.ceil(remainingDistanceInFeet / 308);
          setEstimatedTime(updatedEstimatedTime);
  
          const distanceToDestination = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            destPoint.latitude,
            destPoint.longitude
          );
  
          if (distanceToDestination <= 20) {
            setHasArrived(true);
            setShowArrivedMessage(true);
            setRoute([]);
            setDestination(null);
            setBearing(0);
            setIsRouteActive(false);
            setEstimatedTime(0);
            setTimeout(() => setShowArrivedMessage(false), 3000);
          }
        }
      }
    }
  }, [
    location,
    destination,
    calculateRoute,
    findCurrentSegment,
    calculateBearing,
    animateCamera,
    calculateTotalDistance,
    calculateDistance
  ]);

  const handleSearch = useCallback(() => {
    if (location && searchQuery) {
      Keyboard.dismiss(); // Dismiss the keyboard
      setHasArrived(false);
      const newDestination = searchQuery.toUpperCase();
      setDestination(newDestination);
      setIsRouteActive(true);
      
      const newRoute = calculateRoute(
        { latitude: location.coords.latitude, longitude: location.coords.longitude },
        newDestination
      );
      setRoute(newRoute);
      
      const estimatedTimeInMinutes = Math.ceil(calculateTotalDistance(newRoute) * 3.28084 / 308);
      setEstimatedTime(estimatedTimeInMinutes);
      
      if (newRoute.length > 1) {
        const start = newRoute[0];
        const end = newRoute[1];
        if (start && end) {
          const newBearing = calculateBearing(start, end);
          setBearing(newBearing);
          
          const destPoint = newRoute[newRoute.length - 1];
          setDestinationCoords(destPoint);
          
          animateCamera({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }, newBearing);
        }
      }
    }
  }, [location, searchQuery, calculateRoute, calculateBearing, animateCamera, calculateTotalDistance]);
  
  const animateCamera = useCallback((targetLocation, targetBearing) => {
    mapRef.current?.animateCamera({
      center: {
        latitude: targetLocation.latitude,
        longitude: targetLocation.longitude,
      },
      heading: targetBearing,
      pitch: 0,
      zoom: 18,
      altitude: 1000,
    }, { duration: 3000 });
  }, []);
  
  
  
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialCamera={{
          center: {
            latitude: location?.coords.latitude || 0,
            longitude: location?.coords.longitude || 0,
          },
          pitch: 0,
          heading: 0,
          altitude: 1000,
          zoom: 18,
        }}
        showsUserLocation={true}
        showsCompass={!isRouteActive}
      >
        <Polyline
          coordinates={polylineCoordinates}
          strokeColor="#4a4a4a"
          strokeWidth={6}
        />
        {route.length > 0 && !hasArrived && (
          <Polyline
            coordinates={route}
            strokeColor="#007AFF"
            strokeWidth={4}
          />
        )}
      </MapView>
      
      <View style={styles.overlay}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Enter destination (A-G)"
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.button} onPress={handleSearch}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>
        
        {isRouteActive && (
  <View style={styles.directionsContainer}>
    <View style={styles.directionsContent}>
      {currentDirection.turn === 'left' && (
        <MaterialIcons name="arrow-back" size={30} color="#007AFF" />
      )}
      {currentDirection.turn === 'right' && (
        <MaterialIcons name="arrow-forward" size={30} color="#007AFF" />
      )}
      <Text style={styles.directionsText}>
        {currentDirection.text}
      </Text>
    </View>
  </View>
)}

        
        {isRouteActive && (
          <View style={styles.routeInfoContainer}>
            <Text style={styles.routeInfoText}>
              Estimated time: {estimatedTime} min
            </Text>
            <TouchableOpacity style={styles.exitButton} onPress={handleExitRoute}>
              <Text style={styles.exitButtonText}>Exit Route</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
  
      {showArrivedMessage && (
        <View style={styles.arrivedMessageContainer}>
          <Text style={styles.arrivedMessageText}>You have arrived!</Text>
        </View>
      )}
  
      {isMapDisabled && (
        <View style={styles.disabledMapContainer}>
          <Text style={styles.disabledMapText}>
            Map is currently unavailable. Please move closer to the designated area.
          </Text>
        </View>
      )}
    </View>
  );
  }