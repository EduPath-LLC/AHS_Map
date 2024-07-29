
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
//   { latitude: 33.10955218, longitude: -96.66107382, reference: 'F108' },
//   { latitude: 33.10949087, longitude: -96.66116680, reference: 'F111' },
//   { latitude: 33.10951721, longitude: -96.66112686, reference: 'F110' },
//   { latitude: 33.10946359, longitude: -96.66120816, reference: 'F112' },
//   { latitude: 33.10941872, longitude: -96.66127622, reference: 'F114' },
//   { latitude: 33.10939153, longitude: -96.66131744, reference: 'F115' },
//   { latitude: 33.10936915, longitude: -96.66135138, reference: 'F116' },
//   { latitude: 33.10933977, longitude: -96.66139594, reference: 'F117' },
//   { latitude: 33.10928326, longitude: -96.66148163, reference: 'F120' },
//   { latitude: 33.10932618, longitude: -96.66141655, reference: 'F119' },
//   { latitude: 33.10932480, longitude: -96.66141863, reference: 'S18' },
//   { latitude: 33.10922702, longitude: -96.66156692, reference: 'F123' },
//   { latitude: 33.10922085, longitude: -96.66157627, reference: 'F124' },
//   { latitude: 33.10918304, longitude: -96.66163361, reference: 'F125' },
//   { latitude: 33.10916888, longitude: -96.66165509, reference: 'F126' },
//   { latitude: 33.10910607, longitude: -96.66175032, reference: 'F128' },
//   { latitude: 33.10909943, longitude: -96.66176040, reference: 'F129' },
//   { latitude: 33.10904726, longitude: -96.66183951, reference: 'F130' },
//   { latitude: 33.10900099, longitude: -96.66190967, reference: 'F133' },

//   { latitude: 33.10883376, longitude: -96.66176128, reference: 'F136' },
//   { latitude: 33.10886333, longitude: -96.66171719, reference: 'F137' },
//   { latitude: 33.10889290, longitude: -96.66167311, reference: 'F138' },
//   { latitude: 33.10892247, longitude: -96.66162902, reference: 'F139' },
//   { latitude: 33.10895204, longitude: -96.66158494, reference: 'F140' },
//   { latitude: 33.10898161, longitude: -96.66154086, reference: 'F141' },
//   { latitude: 33.10901118, longitude: -96.66149677, reference: 'F144' },
//   { latitude: 33.10904075, longitude: -96.66145269, reference: 'F145' },
//   { latitude: 33.10907032, longitude: -96.66140860, reference: 'F146' },
//   { latitude: 33.10909989, longitude: -96.66136452, reference: 'F148' },
//   { latitude: 33.10912945, longitude: -96.66132043, reference: 'F149' },
//   { latitude: 33.10915902, longitude: -96.66127635, reference: 'F153' },
//   { latitude: 33.10918859, longitude: -96.66123226, reference: 'F154' },
//   { latitude: 33.10921816, longitude: -96.66118818, reference: 'F155' },
//   { latitude: 33.10924773, longitude: -96.66114409, reference: 'F156' },
//   { latitude: 33.10927730, longitude: -96.66110001, reference: 'F158' },
//   { latitude: 33.10930687, longitude: -96.66105592, reference: 'F160' },
//   { latitude: 33.10933644, longitude: -96.66101184, reference: 'F161' },
//   { latitude: 33.10936601, longitude: -96.66096776, reference: 'F163' },
//   { latitude: 33.10939558, longitude: -96.66092367, reference: 'F164' }
// ];
// function isPointOnRight(lineStart, lineEnd, point) {
//   return ((lineEnd.longitude - lineStart.longitude) * (point.latitude - lineStart.latitude) - 
//           (lineEnd.latitude - lineStart.latitude) * (point.longitude - lineStart.longitude)) > 0;
// }

// const roomCoordinates = {
//   F108: { latitude: 33.10959167, longitude: -96.6611234 },
//   F111: { latitude: 33.10953419, longitude: -96.66120964 },
//   F110: { latitude: 33.10946790, longitude: -96.66108344 },
//   F112: { latitude: 33.10950205, longitude: -96.66126420 },
//   F114: { latitude: 33.10937894, longitude: -96.66123695 },
//   F115: { latitude: 33.10943479, longitude: -96.66136275 },
//   F116: { latitude: 33.10941588, longitude: -96.66139435 },
//   F117: { latitude: 33.10930108, longitude: -96.66136090 },
//   F120: { latitude: 33.10932997, longitude: -96.66152640 },
//   F119: { latitude: 33.10929958, longitude: -96.66139901 },
//   F123: { latitude: 33.10919474, longitude: -96.66153375 },
//   F124: { latitude: 33.10925905, longitude: -96.66161894 },
//   F125: { latitude: 33.10921808, longitude: -96.66167626 },
//   F126: { latitude: 33.10913219, longitude: -96.66161789 },
//   F128: { latitude: 33.10907955, longitude: -96.66171981 },
//   F129: { latitude: 33.10913878, longitude: -96.66180036 },
//   F130: { latitude: 33.10908186, longitude: -96.66186708 },
//   F131: { latitude: 33.10901877, longitude: -96.66180897 },
//   F133: { latitude: 33.10903478, longitude: -96.66193809 },

//   F136: { latitude: 33.10880684, longitude: -96.66172540 },
//   F137: { latitude: 33.10883337, longitude: -96.66168656 },
//   F138: { latitude: 33.10891935, longitude: -96.66171985 },
//   F139: { latitude: 33.10886242, longitude: -96.66165558 },
//   F140: { latitude: 33.10899026, longitude: -96.66160587 },
//   F141: { latitude: 33.10893572, longitude: -96.66154236 },
//   F144: { latitude: 33.10898758, longitude: -96.66146447 },
//   F145: { latitude: 33.10904345, longitude: -96.66151760 },
//   F146: { latitude: 33.10900063, longitude: -96.66143651 },
//   F148: { latitude: 33.10908299, longitude: -96.66131832 },
//   F149: { latitude: 33.10915934, longitude: -96.66133285 },
//   F153: { latitude: 33.10920637, longitude: -96.66127296 },
//   F154: { latitude: 33.10916137, longitude: -96.66119282 },
//   F155: { latitude: 33.10919531, longitude: -96.66113909 },
//   F156: { latitude: 33.10928420, longitude: -96.66114966 },
//   F158: { latitude: 33.10937162, longitude: -96.66111840 },
//   F160: { latitude: 33.10929493, longitude: -96.66100196 },
//   F161: { latitude: 33.10938663, longitude: -96.66101313 },
//   F163: { latitude: 33.10935875, longitude: -96.66088543 },
//   F164: { latitude: 33.10939019, longitude: -96.66085111 }
// };


// function findRoomCoordinates(reference) {
//   return roomCoordinates[reference] || null;
// }
// // Adjust overlapping segments

// function distanceToSegment(point, segmentStart, segmentEnd) {
//   const x = point.longitude;
//   const y = point.latitude;
//   const x1 = segmentStart.longitude;
//   const y1 = segmentStart.latitude;
//   const x2 = segmentEnd.longitude;
//   const y2 = segmentEnd.latitude;

//   const A = x - x1;
//   const B = y - y1;
//   const C = x2 - x1;
//   const D = y2 - y1;

//   const dot = A * C + B * D;
//   const lenSq = C * C + D * D;
//   let param = -1;

//   if (lenSq !== 0) {
//     param = dot / lenSq;
//   }

//   let xx, yy;

//   if (param < 0) {
//     xx = x1;
//     yy = y1;
//   } else if (param > 1) {
//     xx = x2;
//     yy = y2;
//   } else {
//     xx = x1 + param * C;
//     yy = y1 + param * D;
//   }

//   const dx = x - xx;
//   const dy = y - yy;

//   return Math.sqrt(dx * dx + dy * dy);
// }

// function createConstrainedGraph(polyline) {
//   const graph = {};

//   for (let i = 0; i < polyline.length; i++) {
//     graph[i] = {};
//     if (i > 0) {
//       graph[i][i - 1] = distance(polyline[i], polyline[i - 1]);
//     }
//     if (i < polyline.length - 1) {
//       graph[i][i + 1] = distance(polyline[i], polyline[i + 1]);
//     }
//   }

//   return graph;
// }

// function distance(point1, point2) {
//   const dx = point1.longitude - point2.longitude;
//   const dy = point1.latitude - point2.latitude;
//   return Math.sqrt(dx * dx + dy * dy);
// }

// function constrainedDijkstra(graph, start, end) {
//   const costs = {};
//   const parents = {};
//   const processed = new Set();

//   Object.keys(graph).forEach(node => {
//     costs[node] = node == start ? 0 : Infinity;
//   });

//   let node = findLowestCostNode(costs, processed);

//   while (node !== null) {
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

//   // Reconstruct the path
//   const path = [];
//   let currentNode = end.toString();
//   while (currentNode !== start.toString()) {
//     path.unshift(parseInt(currentNode));
//     currentNode = parents[currentNode];
//   }
//   path.unshift(parseInt(start));

//   return path;
// }

// function findLowestCostNode(costs, processed) {
//   return Object.keys(costs).reduce((lowest, node) => {
//     if (lowest === null && !processed.has(node)) {
//       lowest = node;
//     }
//     if (!processed.has(node) && costs[node] < costs[lowest]) {
//       lowest = node;
//     }
//     return lowest;
//   }, null);
// }

// function findNearestPointOnPolyline(point) {
//   if (!point || typeof point.latitude !== 'number' || typeof point.longitude !== 'number') {
//     console.error('Invalid point:', point);
//     return null;
//   }

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

//   if (!nearestPoint) {
//     console.error('Could not find nearest point on polyline');
//     return null;
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



// // function getCombinedDirections(route) {
// //   let combinedDistance = 0;
// //   let lastTurn = null;
  
// //   for (let i = 0; i < route.length - 1; i++) {
// //     const start = route[i];
// //     const end = route[i + 1];
// //     const segmentDistance = calculateDistance(
// //       start.latitude,
// //       start.longitude,
// //       end.latitude,
// //       end.longitude
// //     );
    
// //     if (i < route.length - 2) {
// //       const nextEnd = route[i + 2];
// //       const currentBearing = calculateBearing(start, end);
// //       const nextBearing = calculateBearing(end, nextEnd);
// //       const turn = calculateTurnDirection(currentBearing, nextBearing);
      
// //       if (turn !== 'straight' || Math.abs(nextBearing - currentBearing) >= 25) {
// //         if (combinedDistance > 0) {
// //           return {
// //             text: `Go straight for ${Math.round(combinedDistance * 3.28084 / 5) * 5} feet`,
// //             turn: 'straight'
// //           };
// //         }
// //         return {
// //           text: `Turn ${turn} in ${Math.round(segmentDistance * 3.28084 / 5) * 5} feet`,
// //           turn: turn
// //         };
// //       }
// //     }
    
// //     combinedDistance += segmentDistance;
// //   }
  
// //   return {
// //     text: `Go straight for ${Math.round(combinedDistance * 3.28084 / 5) * 5} feet and you will arrive at your destination`,
// //     turn: 'straight'
// //   };
// // }
// function getCombinedDirections(route) {
//   let combinedDistance = 0;
  
//   for (let i = 0; i < route.length - 1; i++) {
//     const start = route[i];
//     const end = route[i + 1];
//     const segmentDistance = calculateDistance(
//       start.latitude,
//       start.longitude,
//       end.latitude,
//       end.longitude
//     );
    
//     combinedDistance += segmentDistance;
    
//     if (i === route.length - 2) {  // If this is the last segment
//       const destinationReference = end.reference;
//       const roomCoords = findRoomCoordinates(destinationReference);
      
//       if (roomCoords) {
//         // Calculate the bearing of the last segment
//         const finalBearing = calculateBearing(start, end);
        
//         // Calculate the bearing from the end of the route to the room
//         const roomBearing = calculateBearing(end, roomCoords);
        
//         // Calculate the relative angle
//         let relativeAngle = roomBearing - finalBearing;
//         if (relativeAngle < -180) relativeAngle += 360;
//         if (relativeAngle > 180) relativeAngle -= 360;
        
//         // Determine if the room is on the right or left
//         const side = relativeAngle > 0 ? 'right' : 'left';
        
//         return {
//           text: `Go straight for ${Math.round(combinedDistance * 3.28084 / 5) * 5} feet, then your destination will be on the ${side}`,
//           turn: 'straight'
//         };
//       }
//     }
    
//     if (i < route.length - 2) {
//       const nextEnd = route[i + 2];
//       const currentBearing = calculateBearing(start, end);
//       const nextBearing = calculateBearing(end, nextEnd);
//       const turn = calculateTurnDirection(currentBearing, nextBearing);
      
//       if (turn !== 'straight' && Math.abs(nextBearing - currentBearing) >= 25) {
//         return {
//           text: `Go straight for ${Math.round(combinedDistance * 3.28084 / 5) * 5} feet, then turn ${turn}`,
//           turn: turn
//         };
//       }
//     }
//   }
  
//   return {
//     text: `Go straight for ${Math.round(combinedDistance * 3.28084 / 5) * 5} feet and you will arrive at your destination`,
//     turn: 'straight'
//   };
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
// function findNearestSegment(point, polyline) {
//   let minDistance = Infinity;
//   let nearestIndex = 0;

//   for (let i = 0; i < polyline.length - 1; i++) {
//     const segmentStart = polyline[i];
//     const segmentEnd = polyline[i + 1];
//     const distance = distanceToSegment(point, segmentStart, segmentEnd);

//     if (distance < minDistance) {
//       minDistance = distance;
//       nearestIndex = i;
//     }
//   }

//   return nearestIndex;
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
  
//   // Debugging statement to see the calculated angle
//   console.log(`currentBearing: ${currentBearing}, nextBearing: ${nextBearing}, angle: ${angle}`);

//   if (angle > 330 || angle <= 30) return 'straight'; // Increased the straight range
//   if (angle > 30 && angle <= 120) return 'right'; // Adjusted range for right turns
//   if (angle > 240 && angle <= 330) return 'left'; // Added specific range for left turns

//   return 'straight'; // Default to straight if none of the above conditions are met
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
 
//   const [nearestPolylinePoint, setNearestPolylinePoint] = useState(null);
  

//   const checkDistanceToPolyline = useCallback((userLocation) => {
//     if (!userLocation) return;

//     const { point: nearestPolylinePoint } = findNearestPointOnPolyline(userLocation);
//     const distanceToPolyline = calculateDistance(
//       userLocation.latitude,
//       userLocation.longitude,
//       nearestPolylinePoint.latitude,
//       nearestPolylinePoint.longitude
//     );

//     setIsMapDisabled(distanceToPolyline > 200);
//   }, []);

//   const calculateRoute = useCallback((start, end) => {
//     // Find the nearest segments for start and end points
//     const startSegment = findNearestSegment(start, polylineCoordinates);
//     const endSegment = polylineCoordinates.findIndex(point => 
//       point.latitude === end.latitude && point.longitude === end.longitude
//     );
  
//     // Create a graph that only allows movement along polyline segments
//     const graph = createConstrainedGraph(polylineCoordinates);
  
//     // Use a constrained pathfinding algorithm
//     const path = constrainedDijkstra(graph, startSegment, endSegment);
  
//     // Convert path of segment indices to actual coordinates
//     const routeCoordinates = path.map(index => polylineCoordinates[index]);
  
//     return routeCoordinates;
//   }, [polylineCoordinates]);

//   useEffect(() => {
//     if (location) {
//       const { point: nearest } = findNearestPointOnPolyline({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude
//       });
//       setNearestPolylinePoint(nearest);
  
//       checkDistanceToPolyline(nearest);
  
//       if (route.length > 1 && destinationCoords) {
//         const { currentSegment, progress, currentBearing, nextBearing } = findCurrentSegment(
//           nearest,
//           route
//         );
  
//         const remainingRoute = route.slice(currentSegment);
//         const combinedDirection = getCombinedDirections(remainingRoute);
//         setCurrentDirection(combinedDirection);
  
//         const remainingDistance = calculateTotalDistance(remainingRoute);
//         const totalRemainingDistanceInFeet = Math.round(Math.round(remainingDistance * 3.28084) / 5) * 5;
//         const updatedEstimatedTime = Math.ceil(totalRemainingDistanceInFeet / 308);
//         setEstimatedTime(updatedEstimatedTime);
  
//         setRemainingDistance(totalRemainingDistanceInFeet);
  
//         const distanceToDestination = calculateDistance(
//           nearest.latitude,
//           nearest.longitude,
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
            
//             animateCamera(nearest, bearing);
//           }
//         }
//       }
//     }
//   }, [location, route, destinationCoords, animateCamera, bearing, checkDistanceToPolyline]);
  
//   useInterval(() => {
//     if (nearestPolylinePoint && mapRef.current) {
//       mapRef.current.animateCamera({
//         center: {
//           latitude: nearestPolylinePoint.latitude,
//           longitude: nearestPolylinePoint.longitude,
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
//     if (nearestPolylinePoint && mapRef.current && isRouteActive) {
//       mapRef.current.animateCamera({
//         center: {
//           latitude: nearestPolylinePoint.latitude,
//           longitude: nearestPolylinePoint.longitude,
//         },
//         heading: bearing,
//         pitch: 0,
//         zoom: 18,
//         altitude: 1000,
//       }, { duration: 1000 });
//     }
//   }, 3000);

  
//   const updateRouteInBackground = useCallback(() => {
//     if (isRouteActive && nearestPolylinePoint && destination) {
//       const newRoute = calculateRoute(
//         nearestPolylinePoint,
//         destination
//       );
      
//       if (newRoute.length > 0) {
//         setRoute(newRoute);
        
//         const remainingDistance = calculateTotalDistance(newRoute);
//         const totalRemainingDistanceInFeet = Math.round(remainingDistance * 3.28084 / 5) * 5;
//         const updatedEstimatedTime = Math.ceil(totalRemainingDistanceInFeet / 308);
//         setEstimatedTime(updatedEstimatedTime);
        
//         if (newRoute.length > 1) {
//           const start = newRoute[0];
//           const end = newRoute[1];
//           if (start && end) {
//             const newBearing = calculateBearing(start, end);
//             setBearing(newBearing);
            
//             const combinedDirection = getCombinedDirections(newRoute);
//             setCurrentDirection(combinedDirection);
            
//             animateCamera(nearestPolylinePoint, newBearing);
//           }
//         }
        
//         const distanceToDestination = calculateDistance(
//           nearestPolylinePoint.latitude,
//           nearestPolylinePoint.longitude,
//           destination.latitude,
//           destination.longitude
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
//           setTimeout(() => setShowArrivedMessage(false), 3000);
//         }
//       }
//     }
//   }, [isRouteActive, nearestPolylinePoint, destination, calculateRoute, calculateTotalDistance, calculateBearing, getCombinedDirections, animateCamera, calculateDistance]);
//   useInterval(() => {
//     if (isRouteActive) {
//       updateRouteInBackground();
//     }
//   }, 3000);
//   const handleExitRoute = useCallback(() => {
//     setRoute([]);
//     setDestination(null);
//     setBearing(0);
//     setIsRouteActive(false);
//     setSearchQuery('');
//     setDestinationCoords(null);
  
//     if (nearestPolylinePoint) {
//       animateCamera({
//         latitude: nearestPolylinePoint.latitude,
//         longitude: nearestPolylinePoint.longitude,
//       }, 0);
//     }
//   }, [nearestPolylinePoint, animateCamera]);

//   // const performSearch = useCallback(() => {
//   //   if (location && destination) {
//   //     const newRoute = calculateRoute(
//   //       { latitude: location.coords.latitude, longitude: location.coords.longitude },
//   //       destination
//   //     );
//   //     setRoute(newRoute);
  
//   //     if (newRoute.length > 1) {
//   //       const { currentSegment } = findCurrentSegment(
//   //         { latitude: location.coords.latitude, longitude: location.coords.longitude },
//   //         newRoute
//   //       );
  
//   //       const start = newRoute[currentSegment];
//   //       const end = newRoute[currentSegment + 1];
//   //       if (start && end) {
//   //         const newBearing = calculateBearing(start, end);
//   //         setBearing(newBearing);
  
//   //         const destPoint = newRoute[newRoute.length - 1];
//   //         setDestinationCoords(destPoint);
  
//   //         animateCamera({
//   //           latitude: location.coords.latitude,
//   //           longitude: location.coords.longitude,
//   //         }, newBearing);
  
//   //         const remainingRoute = newRoute.slice(currentSegment);
//   //         const remainingDistance = calculateTotalDistance(remainingRoute);
//   //         const remainingDistanceInFeet = Math.round(Math.round(remainingDistance * 3.28084) / 5) * 5;
//   //         const updatedEstimatedTime = Math.ceil(remainingDistanceInFeet / 308);
//   //         setEstimatedTime(updatedEstimatedTime);
  
//   //         const distanceToDestination = calculateDistance(
//   //           location.coords.latitude,
//   //           location.coords.longitude,
//   //           destPoint.latitude,
//   //           destPoint.longitude
//   //         );
  
//   //         if (distanceToDestination <= 2) {
//   //           setHasArrived(true);
//   //           setShowArrivedMessage(true);
//   //           setRoute([]);
//   //           setDestination(null);
//   //           setBearing(0);
//   //           setIsRouteActive(false);
//   //           setEstimatedTime(0);
//   //           setTimeout(() => setShowArrivedMessage(false), 3000);
//   //         }
//   //       }
//   //     }
//   //   }
//   // }, [
//   //   location,
//   //   destination,
//   //   calculateRoute,
//   //   findCurrentSegment,
//   //   calculateBearing,
//   //   animateCamera,
//   //   calculateTotalDistance,
//   //   calculateDistance
//   // ]);

//   const handleSearch = useCallback(() => {
//     if (nearestPolylinePoint && searchQuery) {
//       Keyboard.dismiss();
//       setHasArrived(false);
//       const newDestination = searchQuery.toUpperCase();
//       const destinationPoint = polylineCoordinates.find(point => point.reference.toUpperCase() === newDestination);
      
//       if (destinationPoint) {
//         setDestination(destinationPoint);
//         setIsRouteActive(true);
        
//         const newRoute = calculateRoute(
//           nearestPolylinePoint,
//           destinationPoint
//         );
        
//         if (newRoute.length > 0) {
//           setRoute(newRoute);
          
//           const estimatedTimeInMinutes = Math.ceil(calculateTotalDistance(newRoute) * 3.28084 / 308);
//           setEstimatedTime(estimatedTimeInMinutes);
          
//           if (newRoute.length > 1) {
//             const start = newRoute[0];
//             const end = newRoute[1];
//             if (start && end) {
//               const newBearing = calculateBearing(start, end);
//               setBearing(newBearing);
              
//               const combinedDirection = getCombinedDirections(newRoute);
//               setCurrentDirection(combinedDirection);
              
//               animateCamera(nearestPolylinePoint, newBearing);
//             }
//           }
//         } else {
//           console.error('Unable to calculate route');
//           alert('Unable to calculate route. Please try again.');
//         }
//       } else {
//         alert("Invalid destination. Please enter a valid hall number (e.g., F108).");
//       }
//     }
//   }, [nearestPolylinePoint, searchQuery, calculateRoute, calculateBearing, animateCamera, calculateTotalDistance, getCombinedDirections]);
  
//   // Add this useEffect hook to handle route updates
//   useEffect(() => {
//     if (isRouteActive && nearestPolylinePoint && destination) {
//       const newRoute = calculateRoute(nearestPolylinePoint, destination);
      
//       if (newRoute.length > 0) {
//         setRoute(newRoute);
        
//         const remainingDistance = calculateTotalDistance(newRoute);
//         const totalRemainingDistanceInFeet = Math.round(remainingDistance * 3.28084 / 5) * 5;
//         const updatedEstimatedTime = Math.ceil(totalRemainingDistanceInFeet / 308);
//         setEstimatedTime(updatedEstimatedTime);
        
//         if (newRoute.length > 1) {
//           const start = newRoute[0];
//           const end = newRoute[1];
//           if (start && end) {
//             const newBearing = calculateBearing(start, end);
//             setBearing(newBearing);
            
//             const combinedDirection = getCombinedDirections(newRoute);
//             setCurrentDirection(combinedDirection);
            
//             animateCamera(nearestPolylinePoint, newBearing);
//           }
//         }
        
//         const distanceToDestination = calculateDistance(
//           nearestPolylinePoint.latitude,
//           nearestPolylinePoint.longitude,
//           destination.latitude,
//           destination.longitude
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
//           setTimeout(() => setShowArrivedMessage(false), 3000);
//         }
//       }
//     }
//   }, [isRouteActive, nearestPolylinePoint, destination, calculateRoute, calculateTotalDistance, calculateBearing, getCombinedDirections, animateCamera, calculateDistance]);
  
//   // Keep the useInterval hook
//   useInterval(() => {
//     if (isRouteActive) {
//       // This will trigger the useEffect hook above
//       setNearestPolylinePoint(prev => ({...prev}));
//     }
//   }, 3000);
  
  

//   const animateCamera = useCallback((targetLocation, targetBearing) => {
//     const { point: nearest } = findNearestPointOnPolyline(targetLocation);
//     mapRef.current?.animateCamera({
//       center: {
//         latitude: nearest.latitude,
//         longitude: nearest.longitude,
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
//             latitude: nearestPolylinePoint?.latitude || location?.coords.latitude || 0,
//             longitude: nearestPolylinePoint?.longitude || location?.coords.longitude || 0,
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
//         {nearestPolylinePoint && (
//           <Marker
//             coordinate={{
//               latitude: nearestPolylinePoint.latitude,
//               longitude: nearestPolylinePoint.longitude
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
//             placeholder="Enter destination (e.g., F108)"
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
// }



















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
  { latitude: 33.10976665, longitude: -96.66104239, reference: 'mainhall1' },
  { latitude: 33.10967387, longitude: -96.66096033, reference: 'mainhall2' },
  { latitude: 33.10955702, longitude: -96.66084956, reference: 'f entrance' },
  { latitude: 33.10947149, longitude: -96.66097674, reference: 'f mid front' },

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

  { latitude: 33.10883376, longitude: -96.66176128, reference: 'F136' },
  { latitude: 33.10886333, longitude: -96.66171719, reference: 'F137' },
  { latitude: 33.10889290, longitude: -96.66167311, reference: 'F138' },
  { latitude: 33.10892247, longitude: -96.66162902, reference: 'F139' },
  { latitude: 33.10895204, longitude: -96.66158494, reference: 'F140' },
  { latitude: 33.10898161, longitude: -96.66154086, reference: 'F141' },
  { latitude: 33.10901118, longitude: -96.66149677, reference: 'F144' },
  { latitude: 33.10904075, longitude: -96.66145269, reference: 'F145' },
  { latitude: 33.10907032, longitude: -96.66140860, reference: 'F146' },
  { latitude: 33.10909989, longitude: -96.66136452, reference: 'F148' },
  { latitude: 33.10912945, longitude: -96.66132043, reference: 'F149' },
  { latitude: 33.10915902, longitude: -96.66127635, reference: 'F153' },
  { latitude: 33.10918859, longitude: -96.66123226, reference: 'F154' },
  { latitude: 33.10921816, longitude: -96.66118818, reference: 'F155' },
  { latitude: 33.10924773, longitude: -96.66114409, reference: 'F156' },
  { latitude: 33.10927730, longitude: -96.66110001, reference: 'F158' },
  { latitude: 33.10930687, longitude: -96.66105592, reference: 'F160' },
  { latitude: 33.10933644, longitude: -96.66101184, reference: 'F161' },
  { latitude: 33.10936601, longitude: -96.66096776, reference: 'F163' },
  { latitude: 33.10939558, longitude: -96.66092367, reference: 'F164' },
  { latitude: 33.10947149, longitude: -96.66097674, reference: 'f mid front' },
  { latitude: 33.10955702, longitude: -96.66084956, reference: 'f entrance' },
  { latitude: 33.10950738, longitude: -96.66079941, reference: 'mainhall3' },
  { latitude: 33.10947111, longitude: -96.66076431, reference: 'mainhall4' },
  { latitude: 33.10935274, longitude: -96.66064305, reference: 'A entrance' },
];

function isPointOnRight(lineStart, lineEnd, point) {
  return ((lineEnd.longitude - lineStart.longitude) * (point.latitude - lineStart.latitude) - 
          (lineEnd.latitude - lineStart.latitude) * (point.longitude - lineStart.longitude)) > 0;
}

const roomCoordinates = {
  F108: { latitude: 33.10959167, longitude: -96.6611234 },
  F111: { latitude: 33.10953419, longitude: -96.66120964 },
  F110: { latitude: 33.10946790, longitude: -96.66108344 },
  F112: { latitude: 33.10950205, longitude: -96.66126420 },
  F114: { latitude: 33.10937894, longitude: -96.66123695 },
  F115: { latitude: 33.10943479, longitude: -96.66136275 },
  F116: { latitude: 33.10941588, longitude: -96.66139435 },
  F117: { latitude: 33.10930108, longitude: -96.66136090 },
  F120: { latitude: 33.10932997, longitude: -96.66152640 },
  F119: { latitude: 33.10929958, longitude: -96.66139901 },
  F123: { latitude: 33.10919474, longitude: -96.66153375 },
  F124: { latitude: 33.10925905, longitude: -96.66161894 },
  F125: { latitude: 33.10921808, longitude: -96.66167626 },
  F126: { latitude: 33.10913219, longitude: -96.66161789 },
  F128: { latitude: 33.10907955, longitude: -96.66171981 },
  F129: { latitude: 33.10913878, longitude: -96.66180036 },
  F130: { latitude: 33.10908186, longitude: -96.66186708 },
  F131: { latitude: 33.10901877, longitude: -96.66180897 },
  F133: { latitude: 33.10903478, longitude: -96.66193809 },

  F136: { latitude: 33.10880684, longitude: -96.66172540 },
  F137: { latitude: 33.10883337, longitude: -96.66168656 },
  F138: { latitude: 33.10891935, longitude: -96.66171985 },
  F139: { latitude: 33.10886242, longitude: -96.66165558 },
  F140: { latitude: 33.10899026, longitude: -96.66160587 },
  F141: { latitude: 33.10893572, longitude: -96.66154236 },
  F144: { latitude: 33.10898758, longitude: -96.66146447 },
  F145: { latitude: 33.10904345, longitude: -96.66151760 },
  F146: { latitude: 33.10900063, longitude: -96.66143651 },
  F148: { latitude: 33.10908299, longitude: -96.66131832 },
  F149: { latitude: 33.10915934, longitude: -96.66133285 },
  F153: { latitude: 33.10920637, longitude: -96.66127296 },
  F154: { latitude: 33.10916137, longitude: -96.66119282 },
  F155: { latitude: 33.10919531, longitude: -96.66113909 },
  F156: { latitude: 33.10928420, longitude: -96.66114966 },
  F158: { latitude: 33.10937162, longitude: -96.66111840 },
  F160: { latitude: 33.10929493, longitude: -96.66100196 },
  F161: { latitude: 33.10938663, longitude: -96.66101313 },
  F163: { latitude: 33.10935875, longitude: -96.66088543 },
  F164: { latitude: 33.10939019, longitude: -96.66085111 }
};


function findRoomCoordinates(reference) {
  return roomCoordinates[reference] || null;
}
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
  const connections = {};

  // Create nodes for each point
  polyline.forEach((point, index) => {
    graph[index] = {};
    connections[index] = new Set();
  });

  // Connect adjacent points and close non-consecutive points
  for (let i = 0; i < polyline.length; i++) {
    for (let j = i + 1; j < polyline.length; j++) {
      const dist = distance(polyline[i], polyline[j]);
      if (j === i + 1 || dist < 0.0001) { // Adjust this threshold as needed
        graph[i][j] = dist;
        graph[j][i] = dist;
        connections[i].add(j);
        connections[j].add(i);
      }
    }
  }

  return { graph, connections };
}

function constrainedDijkstra(graphData, start, end) {
  const { graph, connections } = graphData;
  const costs = {};
  const parents = {};
  const processed = new Set();

  Object.keys(graph).forEach(node => {
    costs[node] = node == start ? 0 : Infinity;
  });

  let node = findLowestCostNode(costs, processed);

  while (node !== null) {
    const cost = costs[node];
    const neighbors = connections[node];

    for (let n of neighbors) {
      const newCost = cost + graph[node][n];
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

function distance(point1, point2) {
  const dx = point1.longitude - point2.longitude;
  const dy = point1.latitude - point2.latitude;
  return Math.sqrt(dx * dx + dy * dy);
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
    
    if (i === route.length - 2) {  // If this is the last segment
      const destinationReference = end.reference;
      const roomCoords = findRoomCoordinates(destinationReference);
      
      if (roomCoords) {
        // Calculate the bearing of the last segment
        const finalBearing = calculateBearing(start, end);
        
        // Calculate the bearing from the end of the route to the room
        const roomBearing = calculateBearing(end, roomCoords);
        
        // Calculate the relative angle
        let relativeAngle = roomBearing - finalBearing;
        if (relativeAngle < -180) relativeAngle += 360;
        if (relativeAngle > 180) relativeAngle -= 360;
        
        // Determine if the room is on the right or left
        const side = relativeAngle > 0 ? 'right' : 'left';
        
        return {
          text: `Go straight for ${Math.round(combinedDistance * 3.28084 / 5) * 5} feet, then your destination will be on the ${side}`,
          turn: 'straight'
        };
      }
    }
    
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

  for (let i = 0; i < polyline.length; i++) {
    const distance = calculateDistance(
      point.latitude,
      point.longitude,
      polyline[i].latitude,
      polyline[i].longitude
    );

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
    const endSegment = findNearestSegment(end, polylineCoordinates);
  
    // Create a graph that allows movement along polyline segments and overlapping points
    const graphData = createConstrainedGraph(polylineCoordinates);
  
    // Use the constrained pathfinding algorithm
    const path = constrainedDijkstra(graphData, startSegment, endSegment);
  
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
        altitude: 2000,
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
        altitude: 2000,
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
      altitude: 2000,
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
    altitude: 2000,
    zoom: 18,
  }}
  showsCompass={!isRouteActive}
  showsPointsOfInterest={false}
  showsBuildings={true}
  showsIndoors={false}
        
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