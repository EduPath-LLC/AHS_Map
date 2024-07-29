// import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
// import { 
//   View,  
//   TextInput, 
//   Text, 
//   TouchableOpacity,
//   Keyboard
// } from 'react-native';
// import MapView, { Polyline, Marker } from 'react-native-maps';
// import { LocationContext } from '../components/providers/LocationContext';
// import { MaterialIcons } from '@expo/vector-icons';

// import { styles } from '../styles/light/MapLight'


// const polylineCoordinates = [
//   { latitude: 33.148972, longitude: -96.695055, reference: 'A' },
//   { latitude: 33.151361, longitude: -96.695055, reference: 'B' },
//   { latitude: 33.15141391078327, longitude: -96.69417595358007, reference: 'B1' },

//   { latitude: 33.151417, longitude: -96.691777, reference: 'C' },
//   { latitude: 33.149250, longitude: -96.691777, reference: 'D' },
//   { latitude: 33.149222, longitude: -96.692694, reference: 'E' },
//   { latitude: 33.148944, longitude: -96.692694, reference: 'F' },
//   { latitude: 33.148972, longitude: -96.695055, reference: 'G' },
// ];

// // Adjust overlapping segments

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

// function useInterval(callback, delay) {
//   const savedCallback = useRef();

//   useEffect(() => {
//     savedCallback.current = callback;
//   }, [callback]);

//   useEffect(() => {
//     function tick() {
//       savedCallback.current();
//     }
//     if (delay !== null) {
//       let id = setInterval(tick, delay);
//       return () => clearInterval(id);
//     }
//   }, [delay]);
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
// function calculateTotalDistance(routeCoordinates) {
//   let totalDistance = 0;
//   for (let i = 0; i < routeCoordinates.length - 1; i++) {
//     totalDistance += calculateDistance(
//       routeCoordinates[i].latitude,
//       routeCoordinates[i].longitude,
//       routeCoordinates[i + 1].latitude,
//       routeCoordinates[i + 1].longitude
//     );
//   }
//   return totalDistance;
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
// function checkDistanceToPolyline(userLocation) {
//   if (!userLocation) return;

//   const { point: nearestPoint } = findNearestPointOnPolyline(userLocation);
//   const distanceToPolyline = calculateDistance(
//     userLocation.latitude,
//     userLocation.longitude,
//     nearestPoint.latitude,
//     nearestPoint.longitude
//   );

//   setIsMapDisabled(distanceToPolyline > 200);
// }
// function calculateRouteLengthInFeet(route) {
//   let totalDistance = 0;
//   for (let i = 0; i < route.length - 1; i++) {
//     totalDistance += calculateDistance(
//       route[i].latitude,
//       route[i].longitude,
//       route[i + 1].latitude,
//       route[i + 1].longitude
//     );
//   }
//   // Convert meters to feet and round to nearest 5
//   return Math.round(totalDistance * 3.28084 / 5) * 5;
// }
// function calculateTurnDirection(currentBearing, nextBearing) {
//   const angle = ((nextBearing - currentBearing + 360) % 360 + 360) % 360;
//   if (angle > 315 || angle <= 45) return 'straight';
//   if (angle > 45 && angle <= 135) return 'right';
//   return 'left';
// }

// // Modify the findCurrentSegment function
// function findCurrentSegment(location, route) {
//   if (!location || !route || route.length < 2) {
//     return { currentSegment: 0, progress: 0, currentBearing: 0, nextBearing: 0 };
//   }

//   let minDistance = Infinity;
//   let currentSegment = 0;
//   let progress = 0;

//   for (let i = 0; i < route.length - 1; i++) {
//     const start = route[i];
//     const end = route[i + 1];
//     if (!start || !end) continue;

//     const nearest = nearestPointOnLineSegment(location, start, end);
//     const dist = distance(location, nearest);

//     if (dist < minDistance) {
//       minDistance = dist;
//       currentSegment = i;
//       progress = distance(start, nearest) / distance(start, end);
//     }
//   }

//   const currentBearing = calculateBearing(route[currentSegment], route[currentSegment + 1]);
//   const nextBearing = currentSegment < route.length - 2 ? 
//     calculateBearing(route[currentSegment + 1], route[currentSegment + 2]) : currentBearing;

//   return { currentSegment, progress, currentBearing, nextBearing };
// }

// export default function Map() {
//   const { location, errorMsg } = useContext(LocationContext);
//   const [estimatedTime, setEstimatedTime] = useState(0);
//   const mapRef = useRef(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [route, setRoute] = useState([]);
//   const [destination, setDestination] = useState(null);
//   const [bearing, setBearing] = useState(0);
//   const [isRouteActive, setIsRouteActive] = useState(false);
//   const [showArrivedMessage, setShowArrivedMessage] = useState(false);
//   const [destinationCoords, setDestinationCoords] = useState(null);
//   const [hasArrived, setHasArrived] = useState(false);
//   const [isMapDisabled, setIsMapDisabled] = useState(false);
//   const [currentDirection, setCurrentDirection] = useState({ text: '', icon: null });
//   const [remainingDistance, setRemainingDistance] = useState(0);
//   const [nearestPoint, setNearestPoint] = useState(null);
  

//   const checkDistanceToPolyline = useCallback((userLocation) => {
//     if (!userLocation) return;

//     const { point: nearestPoint } = findNearestPointOnPolyline(userLocation);
//     const distanceToPolyline = calculateDistance(
//       userLocation.latitude,
//       userLocation.longitude,
//       nearestPoint.latitude,
//       nearestPoint.longitude
//     );

//     setIsMapDisabled(distanceToPolyline > 200);
//   }, []);

//   const calculateRoute = useCallback((start, end) => {
//     const { point: startPoint, segmentIndex } = findNearestPointOnPolyline(start);
    
//     const graph = {};
    
//     for (let i = 0; i < polylineCoordinates.length; i++) {
//       const point = polylineCoordinates[i];
//       const nextPoint = polylineCoordinates[(i + 1) % polylineCoordinates.length];
      
//       if (!graph[point.reference]) graph[point.reference] = {};
//       if (!graph[nextPoint.reference]) graph[nextPoint.reference] = {};
      
//       graph[point.reference][nextPoint.reference] = distance(point, nextPoint);
//       graph[nextPoint.reference][point.reference] = distance(nextPoint, point);
//     }
    
//     graph[startPoint.reference] = {};
//     graph[startPoint.reference][polylineCoordinates[segmentIndex].reference] = distance(startPoint, polylineCoordinates[segmentIndex]);
//     graph[startPoint.reference][polylineCoordinates[(segmentIndex + 1) % polylineCoordinates.length].reference] = distance(startPoint, polylineCoordinates[(segmentIndex + 1) % polylineCoordinates.length]);
    
//     graph[polylineCoordinates[segmentIndex].reference][startPoint.reference] = graph[startPoint.reference][polylineCoordinates[segmentIndex].reference];
//     graph[polylineCoordinates[(segmentIndex + 1) % polylineCoordinates.length].reference][startPoint.reference] = graph[startPoint.reference][polylineCoordinates[(segmentIndex + 1) % polylineCoordinates.length].reference];

//     const path = dijkstra(graph, startPoint.reference, end);
    
//     const routeCoordinates = [startPoint];
//     for (let i = 1; i < path.length; i++) {
//       const currentRef = path[i];
//       const currentPoint = polylineCoordinates.find(p => p.reference === currentRef) || startPoint;
//       routeCoordinates.push(currentPoint);
//     }

//     return routeCoordinates;
//   }, []);

//   useEffect(() => {
//     if (location) {
//       const { point } = findNearestPointOnPolyline({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude
//       });
//       setNearestPoint(point);
  
//       checkDistanceToPolyline(point);
  
//       if (route.length > 1 && destinationCoords) {
//         const { currentSegment, progress, currentBearing, nextBearing } = findCurrentSegment(
//           point,
//           route
//         );
  
//         const currentSegmentDistance = calculateDistance(
//           route[currentSegment].latitude,
//           route[currentSegment].longitude,
//           route[currentSegment + 1].latitude,
//           route[currentSegment + 1].longitude
//         );
//         const remainingSegmentDistance = currentSegmentDistance * (1 - progress);
  
//         const remainingDistanceInFeet = Math.round(remainingSegmentDistance * 3.28084 / 5) * 5;
//         setRemainingDistance(remainingDistanceInFeet);
  
//         if (currentSegment < route.length - 2) {
//           const turnDirection = calculateTurnDirection(currentBearing, nextBearing);
//           setCurrentDirection({
//             text: `Turn ${turnDirection} in ${remainingDistanceInFeet} feet`,
//             turn: turnDirection
//           });
//         } else if (currentSegment === route.length - 2) {
//           setCurrentDirection({
//             text: `Go straight for ${remainingDistanceInFeet} feet and you will arrive at your destination`,
//             turn: null
//           });
//         }
  
//         const remainingRoute = route.slice(currentSegment);
//         const remainingDistance = calculateTotalDistance(remainingRoute);
//         const totalRemainingDistanceInFeet = Math.round(Math.round(remainingDistance * 3.28084) / 5) * 5;
//         const updatedEstimatedTime = Math.ceil(totalRemainingDistanceInFeet / 308);
//         setEstimatedTime(updatedEstimatedTime);
  
//         const distanceToDestination = calculateDistance(
//           point.latitude,
//           point.longitude,
//           destinationCoords.latitude,
//           destinationCoords.longitude
//         );
  
//         if (distanceToDestination <= 10) {
//           setHasArrived(true);
//           setShowArrivedMessage(true);
//           setRoute([]);
//           setDestination(null);
//           setBearing(0);
//           setIsRouteActive(false);
//           setEstimatedTime(0);
//           setCurrentDirection({ text: '', turn: null });
//           setSearchQuery('');
//           setTimeout(() => setShowArrivedMessage(false), 3000);
//         } else {
//           if (currentSegment < route.length - 1) {
//             const start = route[currentSegment];
//             const end = route[currentSegment + 1];
  
//             if (start && end) {
//               const newBearing = calculateBearing(start, end);
//               setBearing(newBearing);
//             }
            
//             animateCamera(point, bearing);
//           }
//         }
//       }
//     }
//   }, [location, route, destinationCoords, animateCamera, bearing, checkDistanceToPolyline]);
  
//   useInterval(() => {
//     if (nearestPoint && mapRef.current) {
//       mapRef.current.animateCamera({
//         center: {
//           latitude: nearestPoint.latitude,
//           longitude: nearestPoint.longitude,
//         },
//         heading: isRouteActive ? bearing : 0,
//         pitch: 0,
//         zoom: 18,
//         altitude: 1000,
//       }, { duration: 1000 });
//     }
//   }, 3000);
  
//   // Modify the existing useInterval hook
//   useInterval(() => {
//     if (nearestPoint && mapRef.current && isRouteActive) {
//       mapRef.current.animateCamera({
//         center: {
//           latitude: nearestPoint.latitude,
//           longitude: nearestPoint.longitude,
//         },
//         heading: bearing,
//         pitch: 0,
//         zoom: 18,
//         altitude: 1000,
//       }, { duration: 1000 });
//     }
//   }, 3000);

//   useInterval(() => {
//     if (isRouteActive && !hasArrived) {
//       performSearch();
//     }
//   }, 3000);
  
//   const handleExitRoute = useCallback(() => {
//     setRoute([]);
//     setDestination(null);
//     setBearing(0);
//     setIsRouteActive(false);
//     setSearchQuery('');
//     setDestinationCoords(null);
  
//     if (nearestPoint) {
//       animateCamera({
//         latitude: nearestPoint.latitude,
//         longitude: nearestPoint.longitude,
//       }, 0);
//     }
//   }, [nearestPoint, animateCamera]);

//   const performSearch = useCallback(() => {
//     if (location && destination) {
//       const newRoute = calculateRoute(
//         { latitude: location.coords.latitude, longitude: location.coords.longitude },
//         destination
//       );
//       setRoute(newRoute);
  
//       if (newRoute.length > 1) {
//         const { currentSegment } = findCurrentSegment(
//           { latitude: location.coords.latitude, longitude: location.coords.longitude },
//           newRoute
//         );
  
//         const start = newRoute[currentSegment];
//         const end = newRoute[currentSegment + 1];
//         if (start && end) {
//           const newBearing = calculateBearing(start, end);
//           setBearing(newBearing);
  
//           const destPoint = newRoute[newRoute.length - 1];
//           setDestinationCoords(destPoint);
  
//           animateCamera({
//             latitude: location.coords.latitude,
//             longitude: location.coords.longitude,
//           }, newBearing);
  
//           const remainingRoute = newRoute.slice(currentSegment);
//           const remainingDistance = calculateTotalDistance(remainingRoute);
//           const remainingDistanceInFeet = Math.round(Math.round(remainingDistance * 3.28084) / 5) * 5;
//           const updatedEstimatedTime = Math.ceil(remainingDistanceInFeet / 308);
//           setEstimatedTime(updatedEstimatedTime);
  
//           const distanceToDestination = calculateDistance(
//             location.coords.latitude,
//             location.coords.longitude,
//             destPoint.latitude,
//             destPoint.longitude
//           );
  
//           if (distanceToDestination <= 20) {
//             setHasArrived(true);
//             setShowArrivedMessage(true);
//             setRoute([]);
//             setDestination(null);
//             setBearing(0);
//             setIsRouteActive(false);
//             setEstimatedTime(0);
//             setTimeout(() => setShowArrivedMessage(false), 3000);
//           }
//         }
//       }
//     }
//   }, [
//     location,
//     destination,
//     calculateRoute,
//     findCurrentSegment,
//     calculateBearing,
//     animateCamera,
//     calculateTotalDistance,
//     calculateDistance
//   ]);

//   const handleSearch = useCallback(() => {
//     if (nearestPoint && searchQuery) {
//       Keyboard.dismiss();
//       setHasArrived(false);
//       const newDestination = searchQuery.toUpperCase();
//       setDestination(newDestination);
//       setIsRouteActive(true);
      
//       const newRoute = calculateRoute(
//         { latitude: nearestPoint.latitude, longitude: nearestPoint.longitude },
//         newDestination
//       );
//       setRoute(newRoute);
      
//       const estimatedTimeInMinutes = Math.ceil(calculateTotalDistance(newRoute) * 3.28084 / 308);
//       setEstimatedTime(estimatedTimeInMinutes);
      
//       if (newRoute.length > 1) {
//         const start = newRoute[0];
//         const end = newRoute[1];
//         if (start && end) {
//           const newBearing = calculateBearing(start, end);
//           setBearing(newBearing);
          
//           const destPoint = newRoute[newRoute.length - 1];
//           setDestinationCoords(destPoint);
          
//           animateCamera(nearestPoint, newBearing);
//         }
//       }
//     }
//   }, [nearestPoint, searchQuery, calculateRoute, calculateBearing, animateCamera, calculateTotalDistance]);
  
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
//     }, { duration: 3000 });
//   }, []);
  
  
  
//   return (
//     <View style={styles.container}>
//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         initialCamera={{
//           center: {
//             latitude: nearestPoint?.latitude || location?.coords.latitude || 0,
//             longitude: nearestPoint?.longitude || location?.coords.longitude || 0,
//           },
//           pitch: 0,
//           heading: 0,
//           altitude: 1000,
//           zoom: 18,
//         }}
//         showsCompass={!isRouteActive}
//       >
//         <Polyline
//           coordinates={polylineCoordinates}
//           strokeColor="#4a4a4a"
//           strokeWidth={6}
//         />
//         {route.length > 0 && !hasArrived && (
//           <Polyline
//             coordinates={route}
//             strokeColor="#007AFF"
//             strokeWidth={4}
//           />
//         )}
//         {nearestPoint && (
//           <Marker
//             coordinate={{
//               latitude: nearestPoint.latitude,
//               longitude: nearestPoint.longitude
//             }}
//           >
//             <View style={styles.customMarker}>
//               <View style={styles.markerInner} />
//             </View>
//           </Marker>
//         )}
//       </MapView>
      
//       <View style={styles.overlay}>
//         <View style={styles.searchContainer}>
//           <TextInput
//             style={styles.searchInput}
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             placeholder="Enter destination (A-G)"
//             placeholderTextColor="#999"
//           />
//           <TouchableOpacity style={styles.button} onPress={handleSearch}>
//             <Text style={styles.buttonText}>Search</Text>
//           </TouchableOpacity>
//         </View>
        
//         {isRouteActive && (
//           <View style={styles.directionsContainer}>
//             <View style={styles.directionsContent}>
//               {currentDirection.turn === 'left' && (
//                 <MaterialIcons name="arrow-back" size={30} color="#007AFF" />
//               )}
//               {currentDirection.turn === 'right' && (
//                 <MaterialIcons name="arrow-forward" size={30} color="#007AFF" />
//               )}
//               <Text style={styles.directionsText}>
//                 {currentDirection.text}
//               </Text>
//             </View>
//           </View>
//         )}
        
//         {isRouteActive && (
//           <View style={styles.routeInfoContainer}>
//             <Text style={styles.routeInfoText}>
//               Estimated time: {estimatedTime} min
//             </Text>
//             <TouchableOpacity style={styles.exitButton} onPress={handleExitRoute}>
//               <Text style={styles.exitButtonText}>Exit Route</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
  
//       {showArrivedMessage && (
//         <View style={styles.arrivedMessageContainer}>
//           <Text style={styles.arrivedMessageText}>You have arrived!</Text>
//         </View>
//       )}
  
//       {isMapDisabled && (
//         <View style={styles.disabledMapContainer}>
//           <Text style={styles.disabledMapText}>
//             Map is currently unavailable. Please move closer to the designated area.
//           </Text>
//         </View>
//       )}
//     </View>
//   );
//   }







import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { 
  View,  
  TextInput, 
  Text, 
  TouchableOpacity,
  Keyboard
} from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { LocationContext } from '../components/providers/LocationContext';
import { MaterialIcons } from '@expo/vector-icons';

import { styles } from '../styles/light/MapLight'
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const polylineCoordinates = [
  { latitude: 33.10955218, longitude: -96.66107382, reference: 'F108' },
  { latitude: 33.10949087, longitude: -96.66116680, reference: 'F111' },
  { latitude: 33.10951721, longitude: -96.66112686, reference: 'F110' },
  { latitude: 33.10946359, longitude: -96.66120816, reference: 'F112' },
  { latitude: 33.10941872, longitude: -96.66127622, reference: 'F114' },
  { latitude: 33.10939153, longitude: -96.66131744, reference: 'F115' },
  { latitude: 33.10936915, longitude: -96.66135138, reference: 'F116' },
  { latitude: 33.10933977, longitude: -96.66139594, reference: 'F117' },
  { latitude: 33.10928326, longitude: -96.66148163, reference: 'F120' },
  { latitude: 33.10932618, longitude: -96.66141655, reference: 'F119' },
  { latitude: 33.10932480, longitude: -96.66141863, reference: 'S18' },
  { latitude: 33.10922702, longitude: -96.66156692, reference: 'F123' },
  { latitude: 33.10922085, longitude: -96.66157627, reference: 'F124' },
  { latitude: 33.10918304, longitude: -96.66163361, reference: 'F125' },
  { latitude: 33.10916888, longitude: -96.66165509, reference: 'F126' },
  { latitude: 33.10910607, longitude: -96.66175032, reference: 'F128' },
  { latitude: 33.10909943, longitude: -96.66176040, reference: 'F129' },
  { latitude: 33.10904726, longitude: -96.66183951, reference: 'F130' },
  { latitude: 33.10900099, longitude: -96.66190967, reference: 'F133' },
  { latitude: 33.10883376, longitude: -96.66175592, reference: 'F136' },
  { latitude: 33.10888798, longitude: -96.66168656, reference: 'F138' },
  { latitude: 33.10895412, longitude: -96.66157711, reference: 'F140' },  // New point added here
];

// Adjust overlapping segments

function distanceToSegment(point, segmentStart, segmentEnd) {
  const x = point.longitude;
  const y = point.latitude;
  const x1 = segmentStart.longitude;
  const y1 = segmentStart.latitude;
  const x2 = segmentEnd.longitude;
  const y2 = segmentEnd.latitude;

  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;

  return Math.sqrt(dx * dx + dy * dy);
}

function createConstrainedGraph(polyline) {
  const graph = {};

  for (let i = 0; i < polyline.length; i++) {
    graph[i] = {};
    if (i > 0) {
      graph[i][i - 1] = distance(polyline[i], polyline[i - 1]);
    }
    if (i < polyline.length - 1) {
      graph[i][i + 1] = distance(polyline[i], polyline[i + 1]);
    }
  }

  return graph;
}

function distance(point1, point2) {
  const dx = point1.longitude - point2.longitude;
  const dy = point1.latitude - point2.latitude;
  return Math.sqrt(dx * dx + dy * dy);
}

function constrainedDijkstra(graph, start, end) {
  const costs = {};
  const parents = {};
  const processed = new Set();

  Object.keys(graph).forEach(node => {
    costs[node] = node == start ? 0 : Infinity;
  });

  let node = findLowestCostNode(costs, processed);

  while (node !== null) {
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

  // Reconstruct the path
  const path = [];
  let currentNode = end.toString();
  while (currentNode !== start.toString()) {
    path.unshift(parseInt(currentNode));
    currentNode = parents[currentNode];
  }
  path.unshift(parseInt(start));

  return path;
}

function findLowestCostNode(costs, processed) {
  return Object.keys(costs).reduce((lowest, node) => {
    if (lowest === null && !processed.has(node)) {
      lowest = node;
    }
    if (!processed.has(node) && costs[node] < costs[lowest]) {
      lowest = node;
    }
    return lowest;
  }, null);
}

function findNearestPointOnPolyline(point) {
  if (!point || typeof point.latitude !== 'number' || typeof point.longitude !== 'number') {
    console.error('Invalid point:', point);
    return null;
  }

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

  if (!nearestPoint) {
    console.error('Could not find nearest point on polyline');
    return null;
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



// function getCombinedDirections(route) {
//   let combinedDistance = 0;
//   let lastTurn = null;
  
//   for (let i = 0; i < route.length - 1; i++) {
//     const start = route[i];
//     const end = route[i + 1];
//     const segmentDistance = calculateDistance(
//       start.latitude,
//       start.longitude,
//       end.latitude,
//       end.longitude
//     );
    
//     if (i < route.length - 2) {
//       const nextEnd = route[i + 2];
//       const currentBearing = calculateBearing(start, end);
//       const nextBearing = calculateBearing(end, nextEnd);
//       const turn = calculateTurnDirection(currentBearing, nextBearing);
      
//       if (turn !== 'straight' || Math.abs(nextBearing - currentBearing) >= 25) {
//         if (combinedDistance > 0) {
//           return {
//             text: `Go straight for ${Math.round(combinedDistance * 3.28084 / 5) * 5} feet`,
//             turn: 'straight'
//           };
//         }
//         return {
//           text: `Turn ${turn} in ${Math.round(segmentDistance * 3.28084 / 5) * 5} feet`,
//           turn: turn
//         };
//       }
//     }
    
//     combinedDistance += segmentDistance;
//   }
  
//   return {
//     text: `Go straight for ${Math.round(combinedDistance * 3.28084 / 5) * 5} feet and you will arrive at your destination`,
//     turn: 'straight'
//   };
// }
function getCombinedDirections(route) {
  let combinedDistance = 0;
  let lastTurn = 'straight';
  
  for (let i = 0; i < route.length - 1; i++) {
    const start = route[i];
    const end = route[i + 1];
    const segmentDistance = calculateDistance(
      start.latitude,
      start.longitude,
      end.latitude,
      end.longitude
    );
    
    combinedDistance += segmentDistance;
    
    if (i < route.length - 2) {
      const nextEnd = route[i + 2];
      const currentBearing = calculateBearing(start, end);
      const nextBearing = calculateBearing(end, nextEnd);
      const turn = calculateTurnDirection(currentBearing, nextBearing);
      
      if (turn !== 'straight' && Math.abs(nextBearing - currentBearing) >= 25) {
        return {
          text: `Go straight for ${Math.round(combinedDistance * 3.28084 / 5) * 5} feet, then turn ${turn}`,
          turn: turn
        };
      }
    }
  }
  
  return {
    text: `Go straight for ${Math.round(combinedDistance * 3.28084 / 5) * 5} feet and you will arrive at your destination`,
    turn: 'straight'
  };
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
function findNearestSegment(point, polyline) {
  let minDistance = Infinity;
  let nearestIndex = 0;

  for (let i = 0; i < polyline.length - 1; i++) {
    const segmentStart = polyline[i];
    const segmentEnd = polyline[i + 1];
    const distance = distanceToSegment(point, segmentStart, segmentEnd);

    if (distance < minDistance) {
      minDistance = distance;
      nearestIndex = i;
    }
  }

  return nearestIndex;
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
  
  // Debugging statement to see the calculated angle
  console.log(`currentBearing: ${currentBearing}, nextBearing: ${nextBearing}, angle: ${angle}`);

  if (angle > 330 || angle <= 30) return 'straight'; // Increased the straight range
  if (angle > 30 && angle <= 120) return 'right'; // Adjusted range for right turns
  if (angle > 240 && angle <= 330) return 'left'; // Added specific range for left turns

  return 'straight'; // Default to straight if none of the above conditions are met
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

export default function Map({userId}) {
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
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const routeFromHome = useRoute();

  useEffect(() => {
    const roomNumber = routeFromHome.params?.roomNumber;
    if (roomNumber !== undefined) {
      setSearchQuery(roomNumber);
    }
  }, [route.params?.roomNumber]);


 
  const [nearestPolylinePoint, setNearestPolylinePoint] = useState(null);
  

  const checkDistanceToPolyline = useCallback((userLocation) => {
    if (!userLocation) return;

    const { point: nearestPolylinePoint } = findNearestPointOnPolyline(userLocation);
    const distanceToPolyline = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      nearestPolylinePoint.latitude,
      nearestPolylinePoint.longitude
    );

    setIsMapDisabled(distanceToPolyline > 200);
  }, []);

  const calculateRoute = useCallback((start, end) => {
    // Find the nearest segments for start and end points
    const startSegment = findNearestSegment(start, polylineCoordinates);
    const endSegment = polylineCoordinates.findIndex(point => 
      point.latitude === end.latitude && point.longitude === end.longitude
    );
  
    // Create a graph that only allows movement along polyline segments
    const graph = createConstrainedGraph(polylineCoordinates);
  
    // Use a constrained pathfinding algorithm
    const path = constrainedDijkstra(graph, startSegment, endSegment);
  
    // Convert path of segment indices to actual coordinates
    const routeCoordinates = path.map(index => polylineCoordinates[index]);
  
    return routeCoordinates;
  }, [polylineCoordinates]);

  useEffect(() => {
    if (location) {
      const { point: nearest } = findNearestPointOnPolyline({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      setNearestPolylinePoint(nearest);
  
      checkDistanceToPolyline(nearest);
  
      if (route.length > 1 && destinationCoords) {
        const { currentSegment, progress, currentBearing, nextBearing } = findCurrentSegment(
          nearest,
          route
        );
  
        const remainingRoute = route.slice(currentSegment);
        const combinedDirection = getCombinedDirections(remainingRoute);
        setCurrentDirection(combinedDirection);
  
        const remainingDistance = calculateTotalDistance(remainingRoute);
        const totalRemainingDistanceInFeet = Math.round(Math.round(remainingDistance * 3.28084) / 5) * 5;
        const updatedEstimatedTime = Math.ceil(totalRemainingDistanceInFeet / 308);
        setEstimatedTime(updatedEstimatedTime);
  
        setRemainingDistance(totalRemainingDistanceInFeet);
  
        const distanceToDestination = calculateDistance(
          nearest.latitude,
          nearest.longitude,
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
            
            animateCamera(nearest, bearing);
          }
        }
      }
    }
  }, [location, route, destinationCoords, animateCamera, bearing, checkDistanceToPolyline]);
  
  useInterval(() => {
    if (nearestPolylinePoint && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: nearestPolylinePoint.latitude,
          longitude: nearestPolylinePoint.longitude,
        },
        heading: isRouteActive ? bearing : 0,
        pitch: 0,
        zoom: 18,
        altitude: 1000,
      }, { duration: 1000 });
    }
  }, 3000);
  
  // Modify the existing useInterval hook
  useInterval(() => {
    if (nearestPolylinePoint && mapRef.current && isRouteActive) {
      mapRef.current.animateCamera({
        center: {
          latitude: nearestPolylinePoint.latitude,
          longitude: nearestPolylinePoint.longitude,
        },
        heading: bearing,
        pitch: 0,
        zoom: 18,
        altitude: 1000,
      }, { duration: 1000 });
    }
  }, 3000);

  
  const updateRouteInBackground = useCallback(() => {
    if (isRouteActive && nearestPolylinePoint && destination) {
      const newRoute = calculateRoute(
        nearestPolylinePoint,
        destination
      );
      
      if (newRoute.length > 0) {
        setRoute(newRoute);
        
        const remainingDistance = calculateTotalDistance(newRoute);
        const totalRemainingDistanceInFeet = Math.round(remainingDistance * 3.28084 / 5) * 5;
        const updatedEstimatedTime = Math.ceil(totalRemainingDistanceInFeet / 308);
        setEstimatedTime(updatedEstimatedTime);
        
        if (newRoute.length > 1) {
          const start = newRoute[0];
          const end = newRoute[1];
          if (start && end) {
            const newBearing = calculateBearing(start, end);
            setBearing(newBearing);
            
            const combinedDirection = getCombinedDirections(newRoute);
            setCurrentDirection(combinedDirection);
            
            animateCamera(nearestPolylinePoint, newBearing);
          }
        }
        
        const distanceToDestination = calculateDistance(
          nearestPolylinePoint.latitude,
          nearestPolylinePoint.longitude,
          destination.latitude,
          destination.longitude
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
          setTimeout(() => setShowArrivedMessage(false), 3000);
        }
      }
    }
  }, [isRouteActive, nearestPolylinePoint, destination, calculateRoute, calculateTotalDistance, calculateBearing, getCombinedDirections, animateCamera, calculateDistance]);
  useInterval(() => {
    if (isRouteActive) {
      updateRouteInBackground();
    }
  }, 3000);
  const handleExitRoute = useCallback(() => {
    setRoute([]);
    setDestination(null);
    setBearing(0);
    setIsRouteActive(false);
    setSearchQuery('');
    setDestinationCoords(null);
  
    if (nearestPolylinePoint) {
      animateCamera({
        latitude: nearestPolylinePoint.latitude,
        longitude: nearestPolylinePoint.longitude,
      }, 0);
    }
  }, [nearestPolylinePoint, animateCamera]);

  // const performSearch = useCallback(() => {
  //   if (location && destination) {
  //     const newRoute = calculateRoute(
  //       { latitude: location.coords.latitude, longitude: location.coords.longitude },
  //       destination
  //     );
  //     setRoute(newRoute);
  
  //     if (newRoute.length > 1) {
  //       const { currentSegment } = findCurrentSegment(
  //         { latitude: location.coords.latitude, longitude: location.coords.longitude },
  //         newRoute
  //       );
  
  //       const start = newRoute[currentSegment];
  //       const end = newRoute[currentSegment + 1];
  //       if (start && end) {
  //         const newBearing = calculateBearing(start, end);
  //         setBearing(newBearing);
  
  //         const destPoint = newRoute[newRoute.length - 1];
  //         setDestinationCoords(destPoint);
  
  //         animateCamera({
  //           latitude: location.coords.latitude,
  //           longitude: location.coords.longitude,
  //         }, newBearing);
  
  //         const remainingRoute = newRoute.slice(currentSegment);
  //         const remainingDistance = calculateTotalDistance(remainingRoute);
  //         const remainingDistanceInFeet = Math.round(Math.round(remainingDistance * 3.28084) / 5) * 5;
  //         const updatedEstimatedTime = Math.ceil(remainingDistanceInFeet / 308);
  //         setEstimatedTime(updatedEstimatedTime);
  
  //         const distanceToDestination = calculateDistance(
  //           location.coords.latitude,
  //           location.coords.longitude,
  //           destPoint.latitude,
  //           destPoint.longitude
  //         );
  
  //         if (distanceToDestination <= 2) {
  //           setHasArrived(true);
  //           setShowArrivedMessage(true);
  //           setRoute([]);
  //           setDestination(null);
  //           setBearing(0);
  //           setIsRouteActive(false);
  //           setEstimatedTime(0);
  //           setTimeout(() => setShowArrivedMessage(false), 3000);
  //         }
  //       }
  //     }
  //   }
  // }, [
  //   location,
  //   destination,
  //   calculateRoute,
  //   findCurrentSegment,
  //   calculateBearing,
  //   animateCamera,
  //   calculateTotalDistance,
  //   calculateDistance
  // ]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await loadSearchHistory(userId);
        setSearchHistory(history);
      } catch (error) {
        console.error('Error fetching search history:', error);
      }
    };
    fetchHistory();
  }, [userId]);

  const saveSearchHistory = async (uid, history) => {
    try {
      const jsonValue = JSON.stringify(history);
      await AsyncStorage.setItem(`@search_history_${uid}`, jsonValue);
    } catch (e) {
      console.error('Failed to save search history.', e);
    }
  };

  const loadSearchHistory = async (uid) => {
    try {
      const jsonValue = await AsyncStorage.getItem(`@search_history_${uid}`);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Failed to load search history.', e);
      return [];
    }
  };

  const handleSearch = useCallback(async () => {
    if (nearestPolylinePoint && searchQuery) {
      Keyboard.dismiss();

      const newSearch = { query: searchQuery, timestamp: new Date().toISOString() };
      const updatedHistory = [...searchHistory, newSearch];
      setSearchHistory(updatedHistory);
      await saveSearchHistory(userId, updatedHistory);
      setShowHistory(false);

      setHasArrived(false);
      const newDestination = searchQuery.toUpperCase();
      const destinationPoint = polylineCoordinates.find(point => point.reference.toUpperCase() === newDestination);

      if (destinationPoint) {
        setDestination(destinationPoint);
        setIsRouteActive(true);

        const newRoute = calculateRoute(nearestPolylinePoint, destinationPoint);

        if (newRoute.length > 0) {
          setRoute(newRoute);

          const estimatedTimeInMinutes = Math.ceil(calculateTotalDistance(newRoute) * 3.28084 / 308);
          setEstimatedTime(estimatedTimeInMinutes);

          if (newRoute.length > 1) {
            const start = newRoute[0];
            const end = newRoute[1];
            if (start && end) {
              const newBearing = calculateBearing(start, end);
              setBearing(newBearing);

              const combinedDirection = getCombinedDirections(newRoute);
              setCurrentDirection(combinedDirection);

              animateCamera(nearestPolylinePoint, newBearing);
            }
          }
        } else {
          console.error('Unable to calculate route');
          alert('Unable to calculate route. Please try again.');
        }
      } else {
        alert("Invalid destination. Please enter a valid hall number (e.g., F108).");
      }
    }
  }, [nearestPolylinePoint, searchQuery, searchHistory, userId, polylineCoordinates, calculateRoute, calculateBearing, animateCamera, calculateTotalDistance, getCombinedDirections]);
  
  // Add this useEffect hook to handle route updates
  useEffect(() => {
    if (isRouteActive && nearestPolylinePoint && destination) {
      const newRoute = calculateRoute(nearestPolylinePoint, destination);
      
      if (newRoute.length > 0) {
        setRoute(newRoute);
        
        const remainingDistance = calculateTotalDistance(newRoute);
        const totalRemainingDistanceInFeet = Math.round(remainingDistance * 3.28084 / 5) * 5;
        const updatedEstimatedTime = Math.ceil(totalRemainingDistanceInFeet / 308);
        setEstimatedTime(updatedEstimatedTime);
        
        if (newRoute.length > 1) {
          const start = newRoute[0];
          const end = newRoute[1];
          if (start && end) {
            const newBearing = calculateBearing(start, end);
            setBearing(newBearing);
            
            const combinedDirection = getCombinedDirections(newRoute);
            setCurrentDirection(combinedDirection);
            
            animateCamera(nearestPolylinePoint, newBearing);
          }
        }
        
        const distanceToDestination = calculateDistance(
          nearestPolylinePoint.latitude,
          nearestPolylinePoint.longitude,
          destination.latitude,
          destination.longitude
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
          setTimeout(() => setShowArrivedMessage(false), 3000);
        }
      }
    }
  }, [isRouteActive, nearestPolylinePoint, destination, calculateRoute, calculateTotalDistance, calculateBearing, getCombinedDirections, animateCamera, calculateDistance]);
  
  // Keep the useInterval hook
  useInterval(() => {
    if (isRouteActive) {
      // This will trigger the useEffect hook above
      setNearestPolylinePoint(prev => ({...prev}));
    }
  }, 3000);
  
  

  const animateCamera = useCallback((targetLocation, targetBearing) => {
    const { point: nearest } = findNearestPointOnPolyline(targetLocation);
    mapRef.current?.animateCamera({
      center: {
        latitude: nearest.latitude,
        longitude: nearest.longitude,
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
            latitude: nearestPolylinePoint?.latitude || location?.coords.latitude || 0,
            longitude: nearestPolylinePoint?.longitude || location?.coords.longitude || 0,
          },
          pitch: 0,
          heading: 0,
          altitude: 1000,
          zoom: 18,
        }}
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
        {nearestPolylinePoint && (
          <Marker
            coordinate={{
              latitude: nearestPolylinePoint.latitude,
              longitude: nearestPolylinePoint.longitude,
            }}
          >
            <View style={styles.customMarker}>
              <View style={styles.markerInner} />
            </View>
          </Marker>
        )}
      </MapView>
  
      <View style={styles.overlay}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setShowHistory(true)}
            placeholder="Enter destination (e.g., F108)"
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.button} onPress={() => handleSearch(searchQuery)}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>
  
        {showHistory && (
          <View style={styles.historyContainer}>
            {searchHistory.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => handleSearch(item.query)}>
                <Text style={styles.historyItem}>{item.query}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
  
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
          <Text style={styles.arrivedMessageText}>Arrived</Text>
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