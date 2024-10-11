import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { View, TextInput, Text, TouchableOpacity, Keyboard, SafeAreaView } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { LocationContext } from '../components/providers/LocationContext';
import { MaterialIcons } from '@expo/vector-icons';
import { debounce } from 'lodash';
import { styles } from '../styles/light/MapLight'
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function determineRealTurns(route) {
  const segments = [];
  let currentSegment = [route[0]];
  let lastSignificantBearing = calculateBearing(route[0], route[1]);

  for (let i = 1; i < route.length; i++) {
    currentSegment.push(route[i]);
    if (i < route.length - 1) {
      const newBearing = calculateBearing(route[i], route[i + 1]);
      let bearingDifference = Math.abs(newBearing - lastSignificantBearing);
      
      if (bearingDifference > 180) {
        bearingDifference = 360 - bearingDifference;
      }
      
      if (bearingDifference >= 80 && bearingDifference <= 100 ||
          (route[i].reference.startsWith('S') && isFloorChange(route[i], route[i+1]))) {
        segments.push(currentSegment);
        currentSegment = [route[i]];
        lastSignificantBearing = newBearing;
        
        // Add this condition to create a new segment after stairs (for both directions)
        if (route[i].reference.startsWith('S')) {
          segments.push([route[i], route[i+1]]);
          currentSegment = [route[i+1]];
          i++;
        }
      }
    }
  }
  
  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  return segments;
}

// Helper function to determine if there's a floor change
function isFloorChange(point1, point2) {
  const isFirstFloor1 = firstFloorCoordinates.some(coord => coord.reference === point1.reference);
  const isFirstFloor2 = firstFloorCoordinates.some(coord => coord.reference === point2.reference);
  return isFirstFloor1 !== isFirstFloor2;
}
const firstFloorCoordinates = [
  { latitude: 33.11012705174, longitude: -96.66134610000, reference: 'mainhall1' },
  { latitude: 33.11005377415, longitude: -96.66127730000, reference: 'mainhall2' },
  { latitude: 33.11001053185, longitude: -96.66123670000, reference: 'mainhall3' },
  { latitude: 33.10978398907, longitude: -96.66102400000, reference: 'mainhall4' },
  { latitude: 33.10958417983, longitude: -96.66083640000, reference: 'mainhall5' },
  { latitude: 33.10957086632, longitude: -96.66082390000, reference: 'f entrance' },
{ latitude: 33.10947149, longitude: -96.6609794, reference: 'f mid front' },
{ latitude: 33.1095631, longitude: -96.66106426, reference: 'TLF' },







{ latitude: 33.10955218, longitude: -96.66107382, reference: 'F108' },
{ latitude: 33.10949087, longitude: -96.66116680, reference: 'F111' },
{ latitude: 33.10951721, longitude: -96.66112686, reference: 'F110' },
{ latitude: 33.10946359, longitude: -96.66120816, reference: 'F112' },
{ latitude: 33.10941872, longitude: -96.66127622, reference: 'F114' },
{ latitude: 33.10939153, longitude: -96.66131744, reference: 'F115' },
{ latitude: 33.10936915, longitude: -96.66135138, reference: 'F116' },
{ latitude: 33.10933977, longitude: -96.66139594, reference: 'F117' },
{ latitude: 33.10928326, longitude: -96.66148163, reference: 'F120' },
{latitude:33.1092741, longitude:-96.6614961, reference: 'midhallcut1'},
{latitude:33.1091114, longitude:-96.6613463, reference: 'midhallcut12'},
{latitude:33.1092741, longitude:-96.6614961, reference: 'midhallcut13'},
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
{ latitude: 33.1094010, longitude: -96.6609141, reference: 'TRF' },
{ latitude: 33.10947149, longitude: -96.6609794, reference: 'f mid front' },
{ latitude: 33.10957086632, longitude: -96.66082390000, reference: 'f entrance' },







// New entries
{ latitude: 33.10937095057, longitude: -96.66063620000, reference: 'a entrance' },
 { latitude: 33.10946603787324, longitude:  -96.66049207061944, reference: 'amidfront' },
 {latitude:33.1095109380455, longitude:-96.66053368788533, reference:'A134'},
 { latitude: 33.10953135976243, longitude: -96.66055364224918, reference: 'A1' },
 { latitude: 33.10956178414, longitude: -96.66050830533, reference: 'A130' },
 { latitude: 33.10961167985, longitude: -96.66043394220, reference: 'A128' },
 { latitude: 33.10963654762, longitude: -96.66039688000, reference: 'A125' },
 { latitude: 33.10961085444, longitude: -96.66043517237, reference: 'A126' },
 { latitude: 33.10968441530, longitude: -96.66032553941, reference: 'A121' },
 { latitude: 33.10970620484, longitude: -96.66029306490, reference: 'A124' },
 { latitude: 33.10972164366, longitude: -96.66027005533, reference: 'A122' },
{ latitude: 33.10955886827335, longitude: -96.66011928918694, reference: 'A116' },
{ latitude: 33.10954361813029, longitude: -96.66014275443264, reference: 'A114' },
{ latitude: 33.10952469860161, longitude: -96.66017186572604, reference: 'A115' },
{ latitude: 33.10946234482971, longitude: -96.6602678088639, reference: 'A112' },
{ latitude: 33.10944770286005, longitude: -96.66029033831916, reference: 'A110' },
{ latitude: 33.10947839516472, longitude: -96.6602431123707, reference: 'A109' },
{ latitude: 33.109399795176294, longitude: -96.66036405340273, reference: 'A108' },
{ latitude: 33.109372346964086, longitude: -96.66040628769791, reference: 'A106' },
{ latitude:33.10940547854645, longitude:-96.66043593912865, reference:'A104'},
{ latitude: 33.10946603787324, longitude:  -96.66049207061944, reference: 'amidfront' },
{ latitude: 33.10937095057, longitude: -96.66063620000, reference: 'a entrance' },
{ latitude: 33.10913120078, longitude: -96.66041110000, reference: 'g entrance' },
{ latitude: 33.10885800744, longitude: -96.66015460000, reference: 'k entrance' }
];

const secondFloorCoordinates = [
  { latitude: 33.10932480, longitude: -96.66141863, reference: 'S18' },
  { latitude: 33.10951721, longitude: -96.66112686, reference: 'F210' },
  { latitude: 33.10939558, longitude: -96.66092367, reference: 'F264' },
];


const firstFloorStaircases = firstFloorCoordinates.filter(coord => coord.reference.startsWith('S'));
const secondFloorStaircases = secondFloorCoordinates.filter(coord => coord.reference.startsWith('S'));




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
F164: { latitude: 33.10939019, longitude: -96.66085111 },
A134: { latitude: 33.10948601, longitude: -96.66057225 },
A130: { latitude: 33.10959816, longitude: -96.66054371 },
A125: { latitude: 33.10960490, longitude: -96.66036520 },
A128: { latitude: 33.10964351, longitude: -96.66047714 },
A126: { latitude: 33.10965822, longitude: -96.66044275 },
A121: { latitude: 33.10965515, longitude: -96.66028765 },
A124: { latitude: 33.10973972, longitude: -96.66032496 },
A122: { latitude: 33.10975995, longitude: -96.66030228 },
A104: { latitude: 33.10937961, longitude: -96.66045985 },
A106: { latitude: 33.10932474, longitude: -96.66040581 },
A108: { latitude: 33.10936681, longitude: -96.66032719 },
A110: { latitude: 33.10941482, longitude: -96.66025949 },
A112: { latitude: 33.10943266, longitude: -96.66023274 },
A109: { latitude: 33.10950628, longitude: -96.66026768 },
A115: { latitude: 33.10956253, longitude: -96.66020162 },
A114: { latitude: 33.10951497, longitude: -96.66011318 },
A116: { latitude: 33.10952823, longitude: -96.66009189 }




};


function findRoomCoordinates(reference) {
return roomCoordinates[reference] || null;
}
// Adjust overlapping segments

function createConstrainedGraph(polyline) {
const graph = {};
const connections = {};
polyline.forEach((point, index) => {
  graph[index] = {};
  connections[index] = new Set();
});
// Connect adjacent points and close non-consecutive points
for (let i = 0; i < polyline.length; i++) {
  for (let j = i + 1; j < polyline.length; j++) {
    const dist = distance(polyline[i], polyline[j]);
    if (j === i + 1 || dist < .00001) { // Adjust this threshold as needed
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
function constrainToAdjacentSegments(currentSegment, newSegment) {
 if (Math.abs(newSegment - currentSegment) <= 1) {
   return newSegment;
 }
 return currentSegment;
}
function findNearestPointOnPolyline(point, errorMargin = 1) {
 if (!point || typeof point.latitude !== 'number' || typeof point.longitude !== 'number') {
   console.error('Invalid point:', point);
   return null;
 }


 let minDistance = Infinity;
 let nearestPoint = null;
 let segmentIndex = -1;


 for (let i = 0; i < firstFloorCoordinates.length - 1; i++) {
   const start = firstFloorCoordinates[i];
   const end = firstFloorCoordinates[i + 1];
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


 // If the nearest point is within the error margin, snap to the polyline
 if (minDistance <= errorMargin) {
   return { point: nearestPoint, segmentIndex };
 } else {
   return { point: point, segmentIndex };
 }
}


function findNearestPoint(target, points) {
  let nearestPoint = null;
  let minDistance = Infinity;

  for (const point of points) {
    const dist = calculateDistance(
      target.latitude,
      target.longitude,
      point.latitude,
      point.longitude
    );
    if (dist < minDistance) {
      minDistance = dist;
      nearestPoint = point;
    }
  }

  return nearestPoint;
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
function getCombinedDirections(route) {
  let combinedDistance = 0;
  let directions = [];

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
      let bearingDifference = Math.abs(nextBearing - currentBearing);
      
      // Normalize bearing difference to be between 0 and 180 degrees
      if (bearingDifference > 180) {
        bearingDifference = 360 - bearingDifference;
      }
      
      // Consider it a turn if the bearing difference is significant (e.g., more than 30 degrees)
      if (bearingDifference > 30) {
        const turn = nextBearing > currentBearing ? 'right' : 'left';
        directions.push({
          text: `Go straight for ${Math.round(combinedDistance * 3.28084 / 5) * 5} feet, then turn ${turn}`,
          turn: turn
        });
        combinedDistance = 0;
      }
    }
  }
  
  // Add the final straight segment
  if (combinedDistance > 0) {
    directions.push({
      text: `Go straight for ${Math.round(combinedDistance * 3.28084 / 5) * 5} feet`,
      turn: 'straight'
    });
  }
  
  // Add destination information
  const destinationReference = route[route.length - 1].reference;
  const roomCoords = findRoomCoordinates(destinationReference);
  if (roomCoords) {
    const finalBearing = calculateBearing(route[route.length - 2], route[route.length - 1]);
    const roomBearing = calculateBearing(route[route.length - 1], roomCoords);
    let relativeAngle = roomBearing - finalBearing;
    if (relativeAngle < -180) relativeAngle += 360;
    if (relativeAngle > 180) relativeAngle -= 360;
    const side = relativeAngle > 0 ? 'right' : 'left';
    directions.push({
      text: `Your destination will be on the ${side}`,
      turn: 'straight'
    });
  }
  
  return directions;
}

function getSegmentDirections(segment, isLastSegment, destination) {
  const start = segment[0];
  const end = segment[segment.length - 1];
  const distance = calculateTotalDistance(segment);
  const distanceInFeet = Math.round(distance * 3.28084 / 5) * 5;
  
  if (segment.length < 2) {
    return { text: "Continue on your current path", turn: 'straight' };
  }

  const currentBearing = calculateBearing(start, segment[1]);
  const nextBearing = calculateBearing(segment[segment.length - 2], end);
  let bearingDifference = nextBearing - currentBearing;
  
  if (bearingDifference > 180) bearingDifference -= 360;
  if (bearingDifference < -180) bearingDifference += 360;

  let turn = 'straight';
  if (Math.abs(bearingDifference) >= 80 && Math.abs(bearingDifference) <= 100) {
    turn = bearingDifference > 0 ? 'right' : 'left';
  }

  let text = `Go straight for ${distanceInFeet} feet`;
  
  if (start.reference.startsWith('S')) {
    const floorDirection = firstFloorCoordinates.some(coord => coord.reference === end.reference) ? 'down' : 'up';
    text = `Take the stairs ${floorDirection} to the ${floorDirection === 'up' ? 'second' : 'first'} floor`;
    turn = 'stairs';
  } else if (segment.length === 2 && segment[0].reference.startsWith('S')) {
    // This is the segment immediately after stairs
    const floorDirection = firstFloorCoordinates.some(coord => coord.reference === end.reference) ? 'first' : 'second';
    text = `After taking the stairs, go straight for ${distanceInFeet} feet on the ${floorDirection} floor`;
  } else if (isLastSegment) {
    const destCoords = findRoomCoordinates(destination);
    if (destCoords) {
      const finalBearing = calculateBearing(segment[segment.length - 2], end);
      const roomBearing = calculateBearing(end, destCoords);
      let relativeAngle = roomBearing - finalBearing;
      if (relativeAngle < -180) relativeAngle += 360;
      if (relativeAngle > 180) relativeAngle -= 360;
      const side = relativeAngle > 0 ? 'right' : 'left';
      text += `. Your destination will be on the ${side}`;
    }
  } else if (turn !== 'straight') {
    text += `, then turn ${turn}`;
  }

  return { text, turn };
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
const [initialSegmentCount, setInitialSegmentCount] = useState(0);
const [lastValidBearing, setLastValidBearing] = useState(0);
const [currentSegment, setCurrentSegment] = useState(0);
const [startingPoint, setStartingPoint] = useState(null);
const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
const [routeSegments, setRouteSegments] = useState([]);
const [startingPointQuery, setStartingPointQuery] = useState('');
const [directions, setDirections] = useState({ text: '', turn: 'straight' });
const [showFirstFloor, setShowFirstFloor] = useState(true);
const [currentFloor, setCurrentFloor] = useState(1);
const [completedSegments, setCompletedSegments] = useState([]);


const toggleFloor = useCallback(() => {
  setShowFirstFloor(prev => !prev);
  setCurrentFloor(prev => prev === 1 ? 2 : 1);
}, []);


const handleEndSegment = useCallback(() => {
  if (currentSegmentIndex < routeSegments.length - 1) {
    const currentSegment = routeSegments[currentSegmentIndex];
    const nextSegment = routeSegments[currentSegmentIndex + 1];
    
    // Check if we're at a staircase
    if (currentSegment[currentSegment.length - 1].reference.startsWith('S')) {
      // Change floor
      setCurrentFloor(prev => prev === 1 ? 2 : 1);
      setShowFirstFloor(prev => !prev);
    }

    const nextIndex = currentSegmentIndex + 1;
    setCurrentSegmentIndex(nextIndex);
    
    const newBearing = calculateBearing(nextSegment[0], nextSegment[nextSegment.length - 1]);
    setBearing(newBearing);

    animateCamera(nextSegment[0], newBearing);

    // Update directions
    const isLastSegment = nextIndex === routeSegments.length - 1;
    const segmentDirections = getSegmentDirections(nextSegment, isLastSegment, searchQuery);
    setDirections(segmentDirections);

    // Update estimated time
    const remainingRoute = routeSegments.slice(nextIndex).flat();
    const remainingDistance = calculateTotalDistance(remainingRoute);
    const updatedEstimatedTime = Math.ceil(remainingDistance * 3.28084 / 308);
    setEstimatedTime(updatedEstimatedTime);
  } else {
    // Route is complete
    setHasArrived(true);
    setShowArrivedMessage(true);
    setRoute([]);
    setRouteSegments([]);
    setDestination(null);
    setBearing(0);
    setIsRouteActive(false);
    setEstimatedTime(0);
    setDirections({ text: '', turn: null });
    setTimeout(() => setShowArrivedMessage(false), 3000);
  }
}, [currentSegmentIndex, routeSegments, calculateBearing, animateCamera, searchQuery, calculateTotalDistance]);


const routeBetweenFloors = (start, end, startFloorCoordinates, endFloorCoordinates, startFloorStaircases, endFloorStaircases) => {
  // Find nearest staircase on start floor
  const nearestStartStaircase = findNearestPoint(start, startFloorStaircases);

  // Route to nearest staircase on start floor
  const startToStaircaseGraphData = createConstrainedGraph(startFloorCoordinates);
  const startSegment = findNearestSegment(start, startFloorCoordinates);
  const staircaseSegment = findNearestSegment(nearestStartStaircase, startFloorCoordinates);
  const startToStaircasePath = constrainedDijkstra(startToStaircaseGraphData, startSegment, staircaseSegment);
  const startToStaircaseRoute = startToStaircasePath.map(index => startFloorCoordinates[index]);

  // Find corresponding staircase on end floor
  const correspondingStaircase = endFloorStaircases.find(stair => stair.reference === nearestStartStaircase.reference);

  // Route from staircase to destination on end floor
  const staircaseToEndGraphData = createConstrainedGraph(endFloorCoordinates);
  const correspondingStaircaseSegment = findNearestSegment(correspondingStaircase, endFloorCoordinates);
  const endSegment = findNearestSegment(end, endFloorCoordinates);
  const staircaseToEndPath = constrainedDijkstra(staircaseToEndGraphData, correspondingStaircaseSegment, endSegment);
  const staircaseToEndRoute = staircaseToEndPath.map(index => endFloorCoordinates[index]);

  return [...startToStaircaseRoute, ...staircaseToEndRoute];
};

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
const updateNearestPolylinePoint = useCallback(() => {
 if (location) {
   const { point: nearest, segmentIndex } = findNearestPointOnPolyline({
     latitude: location.coords.latitude,
     longitude: location.coords.longitude
   });
  
   const constrainedSegment = constrainToAdjacentSegments(currentSegment, segmentIndex);
   setCurrentSegment(constrainedSegment);
  
   const constrainedPoint = firstFloorCoordinates[constrainedSegment];
   setNearestPolylinePoint(constrainedPoint);
   checkDistanceToPolyline(constrainedPoint);
 }
}, [location, currentSegment, checkDistanceToPolyline]);






useEffect(() => {
 const nearestPointInterval = setInterval(updateNearestPolylinePoint, 100); // Update every 100ms


 return () => {
   clearInterval(nearestPointInterval);
 };
}, [updateNearestPolylinePoint]);


const calculateRoute = useCallback((start, end) => {
  try {
    let routeCoordinates = [];
    const startFloor = firstFloorCoordinates.some(coord => coord.reference === start.reference) ? 1 : 2;
    const endFloor = firstFloorCoordinates.some(coord => coord.reference === end.reference) ? 1 : 2;

    if (startFloor === endFloor) {
      // Same floor routing (unchanged)
      const coordinates = startFloor === 1 ? firstFloorCoordinates : secondFloorCoordinates;
      const startSegment = findNearestSegment(start, coordinates);
      const endSegment = findNearestSegment(end, coordinates);
      const graphData = createConstrainedGraph(coordinates);
      const path = constrainedDijkstra(graphData, startSegment, endSegment);
      routeCoordinates = path.map(index => coordinates[index]);
    } else {
      // Different floor routing
      if (startFloor === 1 && endFloor === 2) {
        routeCoordinates = routeBetweenFloors(start, end, firstFloorCoordinates, secondFloorCoordinates, firstFloorStaircases, secondFloorStaircases);
      } else {
        routeCoordinates = routeBetweenFloors(start, end, secondFloorCoordinates, firstFloorCoordinates, secondFloorStaircases, firstFloorStaircases);
      }
    }

    return routeCoordinates;
  } catch (error) {
    console.error('Error calculating route:', error);
    return [start, end];
  }
}, [firstFloorCoordinates, secondFloorCoordinates, firstFloorStaircases, secondFloorStaircases, findNearestSegment, createConstrainedGraph, constrainedDijkstra, findNearestPoint]);
useEffect(() => {
  const debouncedLocationUpdate = debounce((newLocation) => {
    if (newLocation) {
      const { point: nearest } = findNearestPointOnPolyline({
        latitude: newLocation.coords.latitude,
        longitude: newLocation.coords.longitude
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
  }, 4000);  // Debounce for 500ms
   debouncedLocationUpdate(location);
   return () => {
    debouncedLocationUpdate.cancel();
  };
}, [location, route, destinationCoords, animateCamera, bearing, checkDistanceToPolyline]);

 // Modify the existing useInterval hook
 useInterval(() => {
  if (isRouteActive && routeSegments[currentSegmentIndex] && mapRef.current) {
    const currentPosition = routeSegments[currentSegmentIndex][0];
    mapRef.current.animateCamera({
      center: {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
      },
      heading: bearing,
      pitch: 0,
      zoom: 18,
      altitude: 2000,
    }, { duration: 1000 });
  }
}, 3000);


const handleExitRoute = useCallback(() => {
  setRoute([]);
  setDestination(null);
  setBearing(0);
  setIsRouteActive(false);
  setSearchQuery('');
  setStartingPointQuery('');  // Add this line
  setDestinationCoords(null);
  setStartingPoint(null);

  if (startingPoint) {
    animateCamera({
      latitude: startingPoint.latitude,
      longitude: startingPoint.longitude,
    }, 0);
  }
}, [startingPoint, animateCamera]);

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
  if (startingPointQuery && searchQuery) {
    Keyboard.dismiss();

    const newSearch = { query: searchQuery, timestamp: new Date().toISOString() };
    const updatedHistory = [...searchHistory, newSearch];
    setSearchHistory(updatedHistory);
    await saveSearchHistory(userId, updatedHistory);
    setShowHistory(false);

    setHasArrived(false);
    const newDestination = searchQuery.toUpperCase();
    const startPoint = [...firstFloorCoordinates, ...secondFloorCoordinates].find(point => point.reference.toUpperCase() === startingPointQuery.toUpperCase());
    const destinationPoint = [...firstFloorCoordinates, ...secondFloorCoordinates].find(point => point.reference.toUpperCase() === newDestination);

    if (startPoint && destinationPoint) {
      setStartingPoint(startPoint);
      setDestination(destinationPoint);
      setIsRouteActive(true);
  
      const startFloor = firstFloorCoordinates.includes(startPoint) ? 1 : 2;
      setCurrentFloor(startFloor);
      setShowFirstFloor(startFloor === 1);
  
      const endFloor = firstFloorCoordinates.includes(destinationPoint) ? 1 : 2;

      const newRoute = calculateRoute(startPoint, destinationPoint);

      if (newRoute.length > 0) {
        const routeSegments = determineRealTurns(newRoute);
        setRoute(newRoute);
        setRouteSegments(routeSegments);
        setCurrentSegmentIndex(0);

        const estimatedTimeInMinutes = Math.ceil(calculateTotalDistance(newRoute) * 3.28084 / 308);
        setEstimatedTime(estimatedTimeInMinutes);

        if (routeSegments.length > 0) {
          const firstSegment = routeSegments[0];
          const newBearing = calculateBearing(firstSegment[0], firstSegment[firstSegment.length - 1]);
          setBearing(newBearing);

          const segmentDirections = getSegmentDirections(firstSegment, routeSegments.length === 1, newDestination);
          setDirections(segmentDirections);

          animateCamera(startPoint, newBearing);
        }
      } else {
        console.error('Unable to calculate route');
        alert('Unable to calculate route. Please try again.');
      }
    } else {
      alert("Invalid starting point or destination. Please enter valid hall numbers (e.g., F108, S18).");
    }
  } else {
    alert("Please enter both a starting point and a destination.");
  }
}, [
  startingPointQuery,
  searchQuery,
  searchHistory,
  userId,
  firstFloorCoordinates,
  secondFloorCoordinates,
  calculateRoute,
  calculateBearing,
  animateCamera,
  calculateTotalDistance,
  saveSearchHistory
]);
 // Add this useEffect hook to handle route updates
 useEffect(() => {
  if (isRouteActive && startingPoint && destination) {
    const newRoute = calculateRoute(startingPoint, destination);

    if (newRoute.length > 0) {
      setRoute(newRoute);
   
      const totalDistance = calculateTotalDistance(newRoute);
      const totalDistanceInFeet = Math.round(totalDistance * 3.28084 / 5) * 5;
      const updatedEstimatedTime = Math.ceil(totalDistanceInFeet / 308);
      setEstimatedTime(updatedEstimatedTime);
   
      if (newRoute.length > 1) {
        const start = newRoute[0];
        const end = newRoute[1];
        if (start && end) {
          const newBearing = calculateBearing(start, end);
          setBearing(newBearing);
       
          const combinedDirection = getCombinedDirections(newRoute);
          setCurrentDirection(combinedDirection);
       
          animateCamera(startingPoint, newBearing);
        }
      }
    }
  }
}, [isRouteActive, startingPoint, destination, calculateRoute, calculateTotalDistance, calculateBearing, getCombinedDirections, animateCamera]);
useInterval(() => {
  if (isRouteActive) {
    // This will trigger the useEffect hook above
    setNearestPolylinePoint(prev => ({...prev}));
  }
}, 3000);








const animateCamera = useCallback((targetLocation, targetBearing) => {
  mapRef.current?.animateCamera({
    center: {
      latitude: targetLocation.latitude,
      longitude: targetLocation.longitude,
    },
    heading: targetBearing,
    pitch: 0,
    zoom: 18,
    altitude: 2000,
  }, { duration: 100 });
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
{isRouteActive && (
  <>
    {routeSegments.slice(currentSegmentIndex).map((segment, index) => {
      const isSegmentOnCurrentFloor = segment.every(point => 
        (currentFloor === 1 && firstFloorCoordinates.some(c => c.reference === point.reference)) ||
        (currentFloor === 2 && secondFloorCoordinates.some(c => c.reference === point.reference))
      );
      
      if (isSegmentOnCurrentFloor) {
        return (
          <Polyline
            key={index}
            coordinates={segment}
            strokeColor="#007AFF"
            strokeWidth={4}
          />
        );
      }
      return null;
    })}
  </>
)}
  {showFirstFloor ? (
    <Polyline
      coordinates={firstFloorCoordinates}
      strokeColor="#4a4a4a"
      strokeWidth={1}
    />
  ) : (
    <Polyline
      coordinates={secondFloorCoordinates}
      strokeColor="#4a4a4a"
      strokeWidth={1}
    />
  )}

      {isRouteActive && routeSegments[currentSegmentIndex] && (
        <Marker
          coordinate={{
            latitude: routeSegments[currentSegmentIndex][0].latitude,
            longitude: routeSegments[currentSegmentIndex][0].longitude,
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
          value={startingPointQuery}
          onChangeText={setStartingPointQuery}
          placeholder="Enter starting point (e.g., F108)"
          placeholderTextColor="#999"
        />
        
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setShowHistory(true)}
          placeholder="Enter destination (e.g., F108)"
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
  style={styles.floorToggleButton} 
  onPress={() => {
    setShowFirstFloor(prev => !prev);
    setCurrentFloor(prev => prev === 1 ? 2 : 1);
  }}
>
  <Text style={styles.floorToggleButtonText}>
    {showFirstFloor ? 'Show 2nd Floor' : 'Show 1st Floor'}
  </Text>
</TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {showHistory && (
        <View style={styles.historyContainer}>
          {searchHistory.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleSearch(item.query)}>
              <Text style={styles.histroyItem}>{item.query}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {isRouteActive && (
        <View style={styles.routeInfoContainer}>
          <Text style={styles.routeInfoText}>
            Estimated time: {estimatedTime} min
          </Text>
          <TouchableOpacity style={styles.endSegmentButton} onPress={handleEndSegment}>
            <Text style={styles.endSegmentButtonText}>End Segment</Text>
          </TouchableOpacity>
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
    {isRouteActive && (
      <SafeAreaView style={styles.directionsContainer}>
        <Text style={styles.directionsText}>{directions.text}</Text>
        {directions.turn !== 'straight' && (
          <MaterialIcons 
            name={directions.turn === 'left' ? 'turn-left' : 'turn-right'} 
            size={24} 
            color="#007AFF" 
          />
        )}
      </SafeAreaView>
    )}
  </View>
);
}



// import React, { useState } from 'react';
    // import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
    // import MapView, { Polyline, Marker } from 'react-native-maps';

    // const firstFloorCoordinates = [
    //   { name: "Main Hall 1", latitude: 33.11012705174, longitude: -96.66134610000 },
    //   { name: "Main Hall 2", latitude: 33.11005377415, longitude: -96.66127730000 },
    //   { name: "Main Hall 3", latitude: 33.11001053185, longitude: -96.66123670000 },
    //   { name: "Main Hall 4", latitude: 33.10978398907, longitude: -96.66102400000 },
    //   { name: "Main Hall 5", latitude: 33.10958417983, longitude: -96.66083640000 },
    //   { name: "Front Entrance", latitude: 33.10957086632, longitude: -96.66082390000 },
    //   { name: "Front Mid", latitude: 33.10947149, longitude: -96.6609794 },
    //   { name: "TLF", latitude: 33.1095631, longitude: -96.66106426 },
    //   { name: "F108", latitude: 33.10955218, longitude: -96.66107382 },
    //   { name: "F111", latitude: 33.10949087, longitude: -96.66116680 },
    //   { name: "F110", latitude: 33.10951721, longitude: -96.66112686 },
    //   { name: "F112", latitude: 33.10946359, longitude: -96.66120816 },
    //   { name: "F114", latitude: 33.10941872, longitude: -96.66127622 },
    //   { name: "F115", latitude: 33.10939153, longitude: -96.66131744 },
    //   { name: "F116", latitude: 33.10936915, longitude: -96.66135138 },
    //   { name: "F117", latitude: 33.10933977, longitude: -96.66139594 },
    //   { name: "F120", latitude: 33.10928326, longitude: -96.66148163 },
    //   { name: "Mid Hall Cut 1", latitude: 33.1092741, longitude: -96.6614961 },
    //   { name: "Mid Hall Cut 12", latitude: 33.1091114, longitude: -96.6613463 },
    //   { name: "Mid Hall Cut 13", latitude: 33.1092741, longitude: -96.6614961 },
    //   { name: "F119", latitude: 33.10932618, longitude: -96.66141655 },
    //   { name: "S18", latitude: 33.10932480, longitude: -96.66141863 },
    //   { name: "F123", latitude: 33.10922702, longitude: -96.66156692 },
    //   { name: "F124", latitude: 33.10922085, longitude: -96.66157627 },
    //   { name: "F125", latitude: 33.10918304, longitude: -96.66163361 },
    //   { name: "F126", latitude: 33.10916888, longitude: -96.66165509 },
    //   { name: "F128", latitude: 33.10910607, longitude: -96.66175032 },
    //   { name: "F129", latitude: 33.10909943, longitude: -96.66176040 },
    //   { name: "F130", latitude: 33.10904726, longitude: -96.66183951 },
    //   { name: "F133", latitude: 33.10900099, longitude: -96.66190967 },
    //   { name: "F136", latitude: 33.10883376, longitude: -96.66176128 },
    //   { name: "F137", latitude: 33.10886333, longitude: -96.66171719 },
    //   { name: "F138", latitude: 33.10889290, longitude: -96.66167311 },
    //   { name: "F139", latitude: 33.10892247, longitude: -96.66162902 },
    //   { name: "F140", latitude: 33.10895204, longitude: -96.66158494 },
    //   { name: "F141", latitude: 33.10898161, longitude: -96.66154086 },
    //   { name: "F144", latitude: 33.10901118, longitude: -96.66149677 },
    //   { name: "F145", latitude: 33.10904075, longitude: -96.66145269 },
    //   { name: "F146", latitude: 33.10907032, longitude: -96.66140860 },
    //   { name: "F148", latitude: 33.10909989, longitude: -96.66136452 },
    //   { name: "F149", latitude: 33.10912945, longitude: -96.66132043 },
    //   { name: "F153", latitude: 33.10915902, longitude: -96.66127635 },
    //   { name: "F154", latitude: 33.10918859, longitude: -96.66123226 },
    //   { name: "F155", latitude: 33.10921816, longitude: -96.66118818 },
    //   { name: "F156", latitude: 33.10924773, longitude: -96.66114409 },
    //   { name: "F158", latitude: 33.10927730, longitude: -96.66110001 },
    //   { name: "F160", latitude: 33.10930687, longitude: -96.66105592 },
    //   { name: "F161", latitude: 33.10933644, longitude: -96.66101184 },
    //   { name: "F163", latitude: 33.10936601, longitude: -96.66096776 },
    //   { name: "F164", latitude: 33.10939558, longitude: -96.66092367 },
    //   { name: "TRF", latitude: 33.1094010, longitude: -96.6609141 },
    //   { name: "A Entrance", latitude: 33.10937095057, longitude: -96.66063620000 },
    //   { name: "A Mid Front", latitude: 33.10946603787324, longitude: -96.66049207061944 },
    //   { name: "A134", latitude: 33.1095109380455, longitude: -96.66053368788533 },
    //   { name: "A1", latitude: 33.10953135976243, longitude: -96.66055364224918 },
    //   { name: "A130", latitude: 33.10956178414, longitude: -96.66050830533 },
    //   { name: "A128", latitude: 33.10961167985, longitude: -96.66043394220 },
    //   { name: "A125", latitude: 33.10963654762, longitude: -96.66039688000 },
    //   { name: "A126", latitude: 33.10961085444, longitude: -96.66043517237 },
    //   { name: "A121", latitude: 33.10968441530, longitude: -96.66032553941 },
    //   { name: "A124", latitude: 33.10970620484, longitude: -96.66029306490 },
    //   { name: "A122", latitude: 33.10972164366, longitude: -96.66027005533 },
    //   { name: "A116", latitude: 33.10955886827335, longitude: -96.66011928918694 },
    //   { name: "A114", latitude: 33.10954361813029, longitude: -96.66014275443264 },
    //   { name: "A115", latitude: 33.10952469860161, longitude: -96.66017186572604 },
    //   { name: "A112", latitude: 33.10946234482971, longitude: -96.6602678088639 },
    //   { name: "A110", latitude: 33.10944770286005, longitude: -96.66029033831916 },
    //   { name: "A109", latitude: 33.10947839516472, longitude: -96.6602431123707 },
    //   { name: "A108", latitude: 33.109399795176294, longitude: -96.66036405340273 },
    //   { name: "A106", latitude: 33.109372346964086, longitude: -96.66040628769791 },
    //   { name: "A104", latitude: 33.10940547854645, longitude: -96.66043593912865 },
    //   { name: "G Entrance", latitude: 33.10913120078, longitude: -96.66041110000 },
    //   { name: "K Entrance", latitude: 33.10885800744, longitude: -96.66015460000 }
    // ];

    // const secondFloorCoordinates = [
    //   { name: "S18", latitude: 33.10932480, longitude: -96.66141863 },
    //   { name: "F210", latitude: 33.10951721, longitude: -96.66112686 },
    //   { name: "F264", latitude: 33.10939558, longitude: -96.66092367 }
    // ];

    // function calculateDistance(coord1, coord2) {
    //   const R = 6371e3; // Earth's radius in meters
    //   const φ1 = coord1.latitude * Math.PI / 180;
    //   const φ2 = coord2.latitude * Math.PI / 180;
    //   const Δφ = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    //   const Δλ = (coord2.longitude - coord1.longitude) * Math.PI / 180;

    //   const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
    //             Math.cos(φ1) * Math.cos(φ2) *
    //             Math.sin(Δλ/2) * Math.sin(Δλ/2);
    //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    //   return R * c;
    // }

    // function findNearestPoint(point, points, excludeSelf = true) {
    //   let nearest = null;
    //   let minDistance = Infinity;

    //   for (const p of points) {
    //     if (excludeSelf && p.name === point.name) continue;
    //     const distance = calculateDistance(point, p);
    //     if (distance < minDistance) {
    //       minDistance = distance;
    //       nearest = p;
    //     }
    //   }

    //   return nearest;
    // }

    // function generateConnections(firstFloorCoordinates, secondFloorCoordinates) {
    //   const allCoordinates = [
    //     ...firstFloorCoordinates.map(coord => ({ ...coord, floor: 1, connections: [] })),
    //     ...secondFloorCoordinates.map(coord => ({ ...coord, floor: 2, connections: [] }))
    //   ];

    //   // Connect points sequentially on the same floor
    //   for (let i = 0; i < allCoordinates.length - 1; i++) {
    //     const current = allCoordinates[i];
    //     const next = allCoordinates[i + 1];
        
    //     if (current.floor === next.floor) {
    //       current.connections.push(next.name);
    //       next.connections.push(current.name);
    //     }
    //   }

    //   // Connect 'S' points between floors and to nearest points on the same floor
    //   allCoordinates.forEach(point => {
    //     if (point.name.startsWith('S')) {
    //       // Connect to the corresponding point on the other floor
    //       const otherFloorPoint = allCoordinates.find(p => p.name === point.name && p.floor !== point.floor);
    //       if (otherFloorPoint) {
    //         point.connections.push(otherFloorPoint.name);
    //         otherFloorPoint.connections.push(point.name);
    //       }

    //       // Connect to the nearest point on the same floor
    //       const sameFloorPoints = allCoordinates.filter(p => p.floor === point.floor);
    //       const nearest = findNearestPoint(point, sameFloorPoints);
    //       if (nearest) {
    //         point.connections.push(nearest.name);
    //         nearest.connections.push(point.name);
    //       }
    //     }
    //   });

    //   return [
    //     allCoordinates.filter(coord => coord.floor === 1),
    //     allCoordinates.filter(coord => coord.floor === 2)
    //   ];
    // }

    // const buildingGraph = generateConnections(firstFloorCoordinates, secondFloorCoordinates);

    // function dijkstra3D(graph, start, end) {
    //   const nodes = graph.flat();
    //   const distances = {};
    //   const previous = {};
    //   const queue = [];

    //   nodes.forEach(node => {
    //     distances[`${node.floor}-${node.name}`] = Infinity;
    //     previous[`${node.floor}-${node.name}`] = null;
    //     queue.push(node);
    //   });

    //   distances[`${start.floor}-${start.name}`] = 0;

    //   while (queue.length > 0) {
    //     queue.sort((a, b) => distances[`${a.floor}-${a.name}`] - distances[`${b.floor}-${b.name}`]);
    //     const current = queue.shift();

    //     if (current.name === end.name && current.floor === end.floor) break;

    //     current.connections.forEach(neighborName => {
    //       const neighbor = nodes.find(node => node.name === neighborName);
    //       if (neighbor) {
    //         const alt = distances[`${current.floor}-${current.name}`] + 1; // Assuming unit distance between connected nodes
    //         if (alt < distances[`${neighbor.floor}-${neighbor.name}`]) {
    //           distances[`${neighbor.floor}-${neighbor.name}`] = alt;
    //           previous[`${neighbor.floor}-${neighbor.name}`] = current;
    //         }
    //       }
    //     });
    //   }

    //   // Reconstruct path
    //   const path = [];
    //   let current = nodes.find(node => node.name === end.name && node.floor === end.floor);
    //   while (current !== null) {
    //     path.unshift(current);
    //     current = previous[`${current.floor}-${current.name}`];
    //   }

    //   return path;
    // }

    // const Map = () => {
    //   const [route, setRoute] = useState([]);
    //   const [startLocation, setStartLocation] = useState('');
    //   const [endLocation, setEndLocation] = useState('');

    //   const handleRoutePress = () => {
    //     const start = buildingGraph.flat().find(node => node.name.toLowerCase() === startLocation.toLowerCase());
    //     const end = buildingGraph.flat().find(node => node.name.toLowerCase() === endLocation.toLowerCase());

    //     if (start && end) {
    //       const routePath = dijkstra3D(buildingGraph, start, end);
    //       setRoute(routePath);
    //     } else {
    //       alert('Invalid start or end location');
    //     }
    //   };

    //   return (
    //     <View style={styles.container}>
    //       <MapView
    //         style={styles.map}
    //         initialRegion={{
    //           latitude: firstFloorCoordinates[0]?.latitude || 0,
    //           longitude: firstFloorCoordinates[0]?.longitude || 0,
    //           latitudeDelta: 0.001,
    //           longitudeDelta: 0.001,
    //         }}
    //       >
    //         <Polyline
    //           coordinates={firstFloorCoordinates}
    //           strokeColor="#000" // Black color for floor layout
    //           strokeWidth={2}
    //         />
    //         {route.map((point, index) => (
    //           <Marker
    //             key={index}
    //             coordinate={{
    //               latitude: point.latitude,
    //               longitude: point.longitude,
    //             }}
    //             title={point.name}
    //           />
    //         ))}
    //         <Polyline
    //           coordinates={route}
    //           strokeColor="#0000FF" // Blue color for route
    //           strokeWidth={3}
    //         />
    //       </MapView>
    //       <View style={styles.inputContainer}>
    //         <TextInput
    //           style={styles.input}
    //           placeholder="Start Location"
    //           value={startLocation}
    //           onChangeText={setStartLocation}
    //         />
    //         <TextInput
    //           style={styles.input}
    //           placeholder="End Location"
    //           value={endLocation}
    //           onChangeText={setEndLocation}
    //         />
    //         <TouchableOpacity style={styles.button} onPress={handleRoutePress}>
    //           <Text>Route</Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   );
    // };

    // const styles = StyleSheet.create({
    //   container: {
    //     ...StyleSheet.absoluteFillObject,
    //   },
    //   map: {
    //     ...StyleSheet.absoluteFillObject,
    //   },
    //   inputContainer: {
    //     position: 'absolute',
    //     top: 80,
    //     left: 20,
    //     right: 20,
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     alignItems: 'center',
    //   },
    //   input: {
    //     flex: 1,
    //     height: 40,
    //     borderColor: 'gray',
    //     borderWidth: 1,
    //     borderRadius: 5,
    //     paddingHorizontal: 10,
    //     backgroundColor: 'white',
    //     marginRight: 10,
    //   },
    //   button: {
    //     backgroundColor: 'white',
    //     padding: 10,
    //     borderRadius: 5,
    //   },
    // });

    // export default Map;