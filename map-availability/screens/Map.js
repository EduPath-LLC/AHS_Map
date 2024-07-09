import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, TextInput, Button, Text } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { LocationContext } from '../components/LocationContext';

import {styles} from '../styles/light/MapLight'

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
function findCurrentSegment(location, route) {
  if (!location || !route || route.length < 2) {
    return { currentSegment: 0, progress: 0 };
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

  return { currentSegment, progress };
}
export default function Map() {
  const { location, errorMsg } = useContext(LocationContext);
  const mapRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [route, setRoute] = useState([]);
  const [destination, setDestination] = useState(null);
  const [bearing, setBearing] = useState(0);
  const [isRouteActive, setIsRouteActive] = useState(false);
  const [showArrivedMessage, setShowArrivedMessage] = useState(false);
const [destinationCoords, setDestinationCoords] = useState(null);

  const calculateRoute = useCallback((start, end) => {
    const { point: startPoint, segmentIndex } = findNearestPointOnPolyline(start);
    
    const graph = {};
    
    // Create graph with connections only between adjacent points on the polyline
    for (let i = 0; i < polylineCoordinates.length; i++) {
      const point = polylineCoordinates[i];
      const nextPoint = polylineCoordinates[(i + 1) % polylineCoordinates.length];
      
      if (!graph[point.reference]) graph[point.reference] = {};
      if (!graph[nextPoint.reference]) graph[nextPoint.reference] = {};
      
      graph[point.reference][nextPoint.reference] = distance(point, nextPoint);
      graph[nextPoint.reference][point.reference] = distance(nextPoint, point);
    }
    
    // Add connections for the start point
    graph[startPoint.reference] = {};
    graph[startPoint.reference][polylineCoordinates[segmentIndex].reference] = distance(startPoint, polylineCoordinates[segmentIndex]);
    graph[startPoint.reference][polylineCoordinates[(segmentIndex + 1) % polylineCoordinates.length].reference] = distance(startPoint, polylineCoordinates[(segmentIndex + 1) % polylineCoordinates.length]);
    
    graph[polylineCoordinates[segmentIndex].reference][startPoint.reference] = graph[startPoint.reference][polylineCoordinates[segmentIndex].reference];
    graph[polylineCoordinates[(segmentIndex + 1) % polylineCoordinates.length].reference][startPoint.reference] = graph[startPoint.reference][polylineCoordinates[(segmentIndex + 1) % polylineCoordinates.length].reference];

    const path = dijkstra(graph, startPoint.reference, end);
    
    // Reconstruct route through polyline
    const routeCoordinates = [startPoint];
    for (let i = 1; i < path.length; i++) {
      const currentRef = path[i];
      const currentPoint = polylineCoordinates.find(p => p.reference === currentRef) || startPoint;
      routeCoordinates.push(currentPoint);
    }

    return routeCoordinates;
  }, []);

  useEffect(() => {
    if (location && route.length > 1) {
      const { currentSegment, progress } = findCurrentSegment(
        { latitude: location.coords.latitude, longitude: location.coords.longitude },
        route
      );
  
      if (currentSegment < route.length - 1) {
        const start = route[currentSegment];
        const end = route[currentSegment + 1];
  
        if (start && end) {
          // Calculate the bearing to the next point on the route
          const newBearing = calculateBearing(start, end);
  
          // If we're close to the end of the segment, look ahead to the next segment
          if (progress > 0.9 && currentSegment < route.length - 2) {
            const nextEnd = route[currentSegment + 2];
            if (nextEnd) {
              const nextBearing = calculateBearing(end, nextEnd);
              // Interpolate between current and next bearing
              const t = (progress - 0.9) / 0.1;
              setBearing(newBearing * (1 - t) + nextBearing * t);
            } else {
              setBearing(newBearing);
            }
          } else {
            setBearing(newBearing);
          }
  
          animateCamera({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }, newBearing);
        }
      }
    }
  }, [location, route, animateCamera]);
  const handleExitRoute = useCallback(() => {
    setRoute([]);
    setDestination(null);
    setBearing(0);
    setIsRouteActive(false);
    setSearchQuery(''); // Clear the search bar
  
    // Reset the map view to the current location
    if (location) {
      animateCamera({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }, 0);
    }
  }, [location, animateCamera]);

  const handleSearch = useCallback(() => {
    if (location && searchQuery) {
      const destination = searchQuery.toUpperCase();
      setDestination(destination);
  
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
  
          // Set destination coordinates
          const destPoint = newRoute[newRoute.length - 1];
          setDestinationCoords(destPoint);
  
          // Animate camera immediately after search
          animateCamera(start, newBearing);
          setIsRouteActive(true);
        }
      }
    }
  }, [location, searchQuery, calculateRoute, animateCamera]);
  
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
    }, { duration: 2000 }); // 2 seconds duration
  }, []);
  useInterval(() => {
    if (location && mapRef.current) {
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
  }, 5000);
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Enter destination (A-G)"
        />
        <Button title="Search" onPress={handleSearch} />
        {isRouteActive && <Button title="Exit Route" onPress={handleExitRoute} />}
      </View>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialCamera={{
            center: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            pitch: 0,
            heading: 0,
            altitude: 1000,
            zoom: 18,
          }}
          showsUserLocation={true}
        >
          <Polyline
            coordinates={polylineCoordinates}
            strokeColor="#4a4a4a"
            strokeWidth={6}
          />
          {route.length > 0 && (
            <Polyline
              coordinates={route}
              strokeColor="#1E90FF"
              strokeWidth={4}
            />
          )}
        </MapView>
      )}
      {showArrivedMessage && (
        <View style={styles.arrivedMessageContainer}>
          <Text style={styles.arrivedMessageText}>You have arrived!</Text>
        </View>
      )}
    </View>
  );
  }

// import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
// import { View, StyleSheet, TextInput, Button, Text } from 'react-native';
// import MapView, { Polyline } from 'react-native-maps';
// import { LocationContext } from '../LocationContext';

// const polylineCoordinates = [
//   { latitude: 33.148972, longitude: -96.695055, reference: 'A' },
//   { latitude: 33.151361, longitude: -96.695055, reference: 'B' },
//   { latitude: 33.151417, longitude: -96.691777, reference: 'C' },
//   { latitude: 33.149250, longitude: -96.691777, reference: 'D' },
//   { latitude: 33.149222, longitude: -96.692694, reference: 'E' },
//   { latitude: 33.148944, longitude: -96.692694, reference: 'F' },
//   { latitude: 33.148972, longitude: -96.695055, reference: 'G' },
// ];

// function distance(point1, point2) {
//   const dx = point1.longitude - point2.longitude;
//   const dy = point1.latitude - point2.latitude;
//   return Math.sqrt(dx * dx + dy * dy);
// }

// function findNearestPointOnPolyline(point) {
//   let minDistance = Infinity;
//   let nearestPoint = null;
//   let segmentIndex = -1;

//   for (let i = 0; i < polylineCoordinates.length; i++) {
//     const start = polylineCoordinates[i];
//     const end = polylineCoordinates[(i + 1) % polylineCoordinates.length];
//     const nearest = nearestPointOnLineSegment(point, start, end);
//     const dist = distance(point, nearest);

//     if (dist < minDistance) {
//       minDistance = dist;
//       nearestPoint = nearest;
//       segmentIndex = i;
//     }
//   }

//   return { point: nearestPoint, segmentIndex };
// }

// function nearestPointOnLineSegment(point, start, end) {
//   const dx = end.longitude - start.longitude;
//   const dy = end.latitude - start.latitude;
//   const t = ((point.longitude - start.longitude) * dx + (point.latitude - start.latitude) * dy) / (dx * dx + dy * dy);
  
//   if (t < 0) return start;
//   if (t > 1) return end;

//   return {
//     latitude: start.latitude + t * dy,
//     longitude: start.longitude + t * dx,
//     reference: 'N' // N for Nearest
//   };
// }

// function dijkstra(graph, start, end) {
//   const costs = {};
//   const parents = {};
//   const processed = new Set();

//   Object.keys(graph).forEach(node => {
//     costs[node] = node === start ? 0 : Infinity;
//   });

//   let node = findLowestCostNode(costs, processed);

//   while (node) {
//     const cost = costs[node];
//     const neighbors = graph[node];

//     for (let n in neighbors) {
//       const newCost = cost + neighbors[n];
//       if (newCost < costs[n]) {
//         costs[n] = newCost;
//         parents[n] = node;
//       }
//     }

//     processed.add(node);
//     node = findLowestCostNode(costs, processed);
//   }

//   const path = [end];
//   let parent = parents[end];
//   while (parent) {
//     path.push(parent);
//     parent = parents[parent];
//   }

//   return path.reverse();
// }

// function findLowestCostNode(costs, processed) {
//   return Object.keys(costs).reduce((lowest, node) => {
//     if (lowest === null || costs[node] < costs[lowest]) {
//       if (!processed.has(node)) {
//         lowest = node;
//       }
//     }
//     return lowest;
//   }, null);
// }

// function calculateBearing(start, end) {
//   const startLat = start.latitude * Math.PI / 180;
//   const startLng = start.longitude * Math.PI / 180;
//   const endLat = end.latitude * Math.PI / 180;
//   const endLng = end.longitude * Math.PI / 180;

//   const y = Math.sin(endLng - startLng) * Math.cos(endLat);
//   const x = Math.cos(startLat) * Math.sin(endLat) -
//             Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);

//   let bearing = Math.atan2(y, x) * 180 / Math.PI;
//   return (bearing + 360) % 360; // Normalize to 0-360
// }
// function calculateDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371e3; // Earth's radius in meters
//   const φ1 = lat1 * Math.PI/180;
//   const φ2 = lat2 * Math.PI/180;
//   const Δφ = (lat2-lat1) * Math.PI/180;
//   const Δλ = (lon2-lon1) * Math.PI/180;

//   const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
//             Math.cos(φ1) * Math.cos(φ2) *
//             Math.sin(Δλ/2) * Math.sin(Δλ/2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

//   return R * c; // Distance in meters
// }
// function findCurrentSegment(location, route) {
//   let minDistance = Infinity;
//   let currentSegment = 0;

//   for (let i = 0; i < route.length - 1; i++) {
//     const start = route[i];
//     const end = route[i + 1];
//     const nearest = nearestPointOnLineSegment(location, start, end);
//     const dist = distance(location, nearest);

//     if (dist < minDistance) {
//       minDistance = dist;
//       currentSegment = i;
//     }
//   }

//   return currentSegment;
// }
// export default function Map() {
//   const { location, errorMsg } = useContext(LocationContext);
//   const mapRef = useRef(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [route, setRoute] = useState([]);
//   const [destination, setDestination] = useState(null);
//   const [bearing, setBearing] = useState(0);
//   const [isRouteActive, setIsRouteActive] = useState(false);
//   const [showArrivedMessage, setShowArrivedMessage] = useState(false);
// const [destinationCoords, setDestinationCoords] = useState(null);

//   const calculateRoute = useCallback((start, end) => {
//     const { point: startPoint, segmentIndex } = findNearestPointOnPolyline(start);
    
//     const graph = {};
    
//     // Create graph with connections only between adjacent points on the polyline
//     for (let i = 0; i < polylineCoordinates.length; i++) {
//       const point = polylineCoordinates[i];
//       const nextPoint = polylineCoordinates[(i + 1) % polylineCoordinates.length];
      
//       if (!graph[point.reference]) graph[point.reference] = {};
//       if (!graph[nextPoint.reference]) graph[nextPoint.reference] = {};
      
//       graph[point.reference][nextPoint.reference] = distance(point, nextPoint);
//       graph[nextPoint.reference][point.reference] = distance(nextPoint, point);
//     }
    
//     // Add connections for the start point
//     graph[startPoint.reference] = {};
//     graph[startPoint.reference][polylineCoordinates[segmentIndex].reference] = distance(startPoint, polylineCoordinates[segmentIndex]);
//     graph[startPoint.reference][polylineCoordinates[(segmentIndex + 1) % polylineCoordinates.length].reference] = distance(startPoint, polylineCoordinates[(segmentIndex + 1) % polylineCoordinates.length]);
    
//     graph[polylineCoordinates[segmentIndex].reference][startPoint.reference] = graph[startPoint.reference][polylineCoordinates[segmentIndex].reference];
//     graph[polylineCoordinates[(segmentIndex + 1) % polylineCoordinates.length].reference][startPoint.reference] = graph[startPoint.reference][polylineCoordinates[(segmentIndex + 1) % polylineCoordinates.length].reference];

//     const path = dijkstra(graph, startPoint.reference, end);
    
//     // Reconstruct route through polyline
//     const routeCoordinates = [startPoint];
//     for (let i = 1; i < path.length; i++) {
//       const currentRef = path[i];
//       const currentPoint = polylineCoordinates.find(p => p.reference === currentRef) || startPoint;
//       routeCoordinates.push(currentPoint);
//     }

//     return routeCoordinates;
//   }, []);

//   useEffect(() => {
//     if (location && destination) {
//       const newRoute = calculateRoute(
//         { latitude: location.coords.latitude, longitude: location.coords.longitude },
//         destination
//       );
//       setRoute(newRoute);
  
//       // Calculate bearing from the start of the route to the next point
//       if (newRoute.length > 1) {
//         const routeStart = newRoute[0];
//         const nextPoint = newRoute[1];
//         const newBearing = calculateBearing(routeStart, nextPoint);
//         setBearing(newBearing);
//       }
//     }
//   }, [location, destination, calculateRoute]);

//   useEffect(() => {
//     if (location && route.length > 1) {
//       const currentSegment = findCurrentSegment(
//         { latitude: location.coords.latitude, longitude: location.coords.longitude },
//         route
//       );
  
//       const start = route[currentSegment];
//       const end = route[currentSegment + 1];
//       const newBearing = calculateBearing(start, end);
//       setBearing(newBearing);
  
//       animateCamera({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       }, newBearing);
//     }
//   }, [location, route, animateCamera]);

//   useEffect(() => {
//     if (location && route.length > 1) {
//       // Find the nearest point on the route to the current location
//       const { point: nearestPoint, segmentIndex } = findNearestPointOnPolyline({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude
//       });
  
//       // If there's a next point on the route, calculate bearing to it
//       if (segmentIndex < route.length - 1) {
//         const nextPoint = route[segmentIndex + 1];
//         const newBearing = calculateBearing(nearestPoint, nextPoint);
//         setBearing(newBearing);
//       }
//     }
//   }, [location, route]);
//   useEffect(() => {
//     if (location && destinationCoords && isRouteActive) {
//       const distance = calculateDistance(
//         location.coords.latitude,
//         location.coords.longitude,
//         destinationCoords.latitude,
//         destinationCoords.longitude
//       );
  
//       if (distance <= 20) {
//         setShowArrivedMessage(true);
//         setRoute([]);
//         setDestination(null);
//         setIsRouteActive(false);
//         setDestinationCoords(null);
//         setSearchQuery(''); // Clear the search bar
  
//         // Hide the message after 3 seconds
//         setTimeout(() => {
//           setShowArrivedMessage(false);
//         }, 3000);
//       }
//     }
//   }, [location, destinationCoords, isRouteActive]);
//   const handleExitRoute = useCallback(() => {
//     setRoute([]);
//     setDestination(null);
//     setBearing(0);
//     setIsRouteActive(false);
//     setSearchQuery(''); // Clear the search bar
  
//     // Reset the map view to the current location
//     if (location) {
//       animateCamera({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       }, 0);
//     }
//   }, [location, animateCamera]);

//   const handleSearch = useCallback(() => {
//     if (location && searchQuery) {
//       const destination = searchQuery.toUpperCase();
//       setDestination(destination);
  
//       const newRoute = calculateRoute(
//         { latitude: location.coords.latitude, longitude: location.coords.longitude },
//         destination
//       );
//       setRoute(newRoute);
  
//       if (newRoute.length > 1) {
//         const currentSegment = findCurrentSegment(
//           { latitude: location.coords.latitude, longitude: location.coords.longitude },
//           newRoute
//         );
  
//         const start = newRoute[currentSegment];
//         const end = newRoute[currentSegment + 1];
//         const newBearing = calculateBearing(start, end);
//         setBearing(newBearing);
  
//         // Set destination coordinates
//         const destPoint = newRoute[newRoute.length - 1];
//         setDestinationCoords(destPoint);
  
//         // Animate camera immediately after search
//         animateCamera(start, newBearing);
//         setIsRouteActive(true);
//       }
//     }
//   }, [location, searchQuery, calculateRoute, animateCamera]);
  
//   const animateCamera = useCallback((targetLocation, targetBearing) => {
//     mapRef.current?.animateCamera({
//       center: {
//         latitude: targetLocation.latitude,
//         longitude: targetLocation.longitude,
//       },
//       heading: targetBearing,
//       pitch: 0,
//       zoom: 18,
//       altitude: 1000,
//     }, { duration: 2000 }); // 2 seconds duration
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           placeholder="Enter destination (A-G)"
//         />
//         <Button title="Search" onPress={handleSearch} />
//         {isRouteActive && <Button title="Exit Route" onPress={handleExitRoute} />}
//       </View>
//       {location && (
//         <MapView
//           ref={mapRef}
//           style={styles.map}
//           initialCamera={{
//             center: {
//               latitude: location.coords.latitude,
//               longitude: location.coords.longitude,
//             },
//             pitch: 0,
//             heading: 0,
//             altitude: 1000,
//             zoom: 18,
//           }}
//           showsUserLocation={true}
//         >
//           <Polyline
//             coordinates={polylineCoordinates}
//             strokeColor="#4a4a4a"
//             strokeWidth={6}
//           />
//           {route.length > 0 && (
//             <Polyline
//               coordinates={route}
//               strokeColor="#1E90FF"
//               strokeWidth={4}
//             />
//           )}
//         </MapView>
//       )}
//       {showArrivedMessage && (
//         <View style={styles.arrivedMessageContainer}>
//           <Text style={styles.arrivedMessageText}>You have arrived!</Text>
//         </View>
//       )}
//     </View>
//   );
//   }
  
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//     },
//     map: {
//       width: '100%',
//       height: '100%',
//     },
//     searchContainer: {
//       position: 'absolute',
//       top: 60,
//       left: 10,
//       right: 10,
//       flexDirection: 'row',
//       zIndex: 1,
//       justifyContent: 'space-between',
//     },
//     searchInput: {
//       flex: 1,
//       height: 40,
//       borderColor: 'gray',
//       borderWidth: 1,
//       paddingHorizontal: 10,
//       backgroundColor: 'white',
//       marginRight: 5,
//     },
//     arrivedMessageContainer: {
//       position: 'absolute',
//       top: '50%',
//       left: 0,
//       right: 0,
//       alignItems: 'center',
//       backgroundColor: 'rgba(0, 0, 0, 0.7)',
//       padding: 20,
//     },
//     arrivedMessageText: {
//       color: 'white',
//       fontSize: 24,
//       fontWeight: 'bold',
//     },
//   });