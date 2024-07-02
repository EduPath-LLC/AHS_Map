import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TextInput, Button, Text } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location'
import { useRoute } from '@react-navigation/native';

export default function Map() {
  const [region, setRegion] = useState({
    latitude: 33.150083,
    longitude: -96.695083,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const route = useRoute();

  const { roomNumber } = route.params || {};



  const [currentLocation, setCurrentLocation] = useState({ latitude: 33.15005556, longitude: -96.695055 });
  const [destination, setDestination] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationData, setLocationData] = useState({});
  const [location, setLocation] = useState({});
  const [altitude, setAltitude] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {

    if(roomNumber){
      setSearchQuery(roomNumber);
    }

    if (mapRef.current) {
      mapRef.current.animateCamera({
        center: currentLocation,
        pitch: 0,
        heading: 0,
        altitude: 1200,
        zoom: 1,
      });
    }

    let subscription;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // 5 seconds
          distanceInterval: 10, // 10 meters
        },
        (newLocation) => {
          setLocationData(newLocation);
          setAltitude(newLocation.coords.altitude);
          let locData = {latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude};
          setLocation(locData)
        }
      );
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };

  }, [roomNumber]);

  const polylineCoordinates = [
    { latitude: 33.148972, longitude: -96.695055, reference: 'A' },
    { latitude: 33.151361, longitude: -96.695055, reference: 'B' },
    { latitude: 33.151417, longitude: -96.691777, reference: 'C' },
    { latitude: 33.149250, longitude: -96.691777, reference: 'D' },
    { latitude: 33.149222, longitude: -96.692694, reference: 'E' },
    { latitude: 33.148944, longitude: -96.692694, reference: 'F' },
    { latitude: 33.148972, longitude: -96.695055, reference: 'G' },
  ];

  const findNearestPoint = (location, points) => {
    return points.reduce((prev, curr) => {
      const prevDistance = Math.hypot(prev.point.latitude - location.latitude, prev.point.longitude - location.longitude);
      const currDistance = Math.hypot(curr.latitude - location.latitude, curr.longitude - location.longitude);
      return currDistance < prevDistance ? { point: curr, distance: currDistance } : prev;
    }, { point: points[0], distance: Infinity });
  };

  const calculateDistance = (point1, point2) => {
    return Math.hypot(point2.latitude - point1.latitude, point2.longitude - point1.longitude);
  };

  const buildGraph = (coordinates, currentLocation) => {
    const graph = {};
    const nearest = findNearestPoint(currentLocation, coordinates);
    
    // Add current location to the graph
    graph['current'] = [
      { reference: nearest.point.reference, distance: nearest.distance },
      { reference: coordinates[(coordinates.indexOf(nearest.point) + 1) % coordinates.length].reference, 
        distance: calculateDistance(currentLocation, coordinates[(coordinates.indexOf(nearest.point) + 1) % coordinates.length]) }
    ];
  
    // Add direct connections to start and end points (A and G)
    const startPoint = coordinates[0];
    const endPoint = coordinates[coordinates.length - 1];
    graph['current'].push(
      { reference: startPoint.reference, distance: calculateDistance(currentLocation, startPoint) },
      { reference: endPoint.reference, distance: calculateDistance(currentLocation, endPoint) }
    );
  
    coordinates.forEach((point, index) => {
      graph[point.reference] = [];
      const nextIndex = (index + 1) % coordinates.length;
      const prevIndex = (index - 1 + coordinates.length) % coordinates.length;
      
      graph[point.reference].push({
        reference: coordinates[nextIndex].reference,
        distance: calculateDistance(point, coordinates[nextIndex])
      });
      graph[point.reference].push({
        reference: coordinates[prevIndex].reference,
        distance: calculateDistance(point, coordinates[prevIndex])
      });
  
      // Connect to current location if it's one of the nearest points or start/end point
      if (point.reference === nearest.point.reference || 
          point.reference === coordinates[(coordinates.indexOf(nearest.point) + 1) % coordinates.length].reference ||
          point === startPoint || point === endPoint) {
        graph[point.reference].push({
          reference: 'current',
          distance: calculateDistance(point, currentLocation)
        });
      }
    });
    return graph;
  };

  const dijkstra = (start, end, graph) => {
    const distances = {};
    const previous = {};
    const queue = [];

    for (let point in graph) {
      distances[point] = Infinity;
      previous[point] = null;
      queue.push(point);
    }
    distances[start] = 0;

    while (queue.length > 0) {
      queue.sort((a, b) => distances[a] - distances[b]);
      const current = queue.shift();

      if (current === end) break;
      if (distances[current] === Infinity) break;

      for (let neighbor of graph[current]) {
        const alt = distances[current] + neighbor.distance;
        if (alt < distances[neighbor.reference]) {
          distances[neighbor.reference] = alt;
          previous[neighbor.reference] = current;
        }
      }
    }

    const path = [];
    let step = end;
    while (previous[step]) {
      path.unshift(step);
      step = previous[step];
    }
    path.unshift(start);
    return path;
  };

  const handleSearch = () => {
    const destinationPoint = polylineCoordinates.find(point => point.reference === searchQuery.toUpperCase());
    if (destinationPoint) {
      setDestination(destinationPoint);

      // Generate the route using Dijkstra's algorithm
      const graph = buildGraph(polylineCoordinates, currentLocation);
      const path = dijkstra('current', destinationPoint.reference, graph);

      // Convert path references to coordinates
      const routeCoords = path.map(ref => {
        if (ref === 'current') return currentLocation;
        return polylineCoordinates.find(point => point.reference === ref);
      });

      // Set route coordinates
      setRouteCoordinates(routeCoords);
    }
  };


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Enter destination reference"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      <MapView
        style={styles.map}
        initialRegion={region}
        region={region}
        onRegionChangeComplete={setRegion}
        showsPointsOfInterest={false}
        showsUserLocation={true}
        zoomEnabled={true}
        showsCompass={true}
        rotateEnabled={true}
        ref={mapRef}
      >
        <Marker coordinate={location} />
        {/* {console.log(location)} */}
        {polylineCoordinates.map((point, index) => (
          <Marker
            key={index}
            coordinate={point}
            title={`Point ${point.reference}`}
            description={`Latitude: ${point.latitude}, Longitude: ${point.longitude}`}
          />
        ))}
        <Marker
          coordinate={currentLocation}
          title="Current Location"
          pinColor="blue"
        />
        <Polyline
          coordinates={polylineCoordinates}
          strokeColor="#07AFF0"
          strokeWidth={4}
        />
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="red"
            strokeWidth={6}
          />
        )}
      </MapView>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: "#E0EDFC",
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
    width: windowWidth * 0.9,
    paddingHorizontal: 10,
  },
  map: {
    width: windowWidth,
    height: windowHeight * 0.7,
    marginVertical: 20,
  },
});
