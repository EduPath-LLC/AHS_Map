import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TextInput, Button } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';

const Map = () => {
  const [region, setRegion] = useState({
    latitude: 33.150083,
    longitude: -96.695083,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [currentLocation, setCurrentLocation] = useState({ latitude: 33.150083, longitude: -96.695083 });
  const [destination, setDestination] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateCamera({
        center: currentLocation,
        pitch: 0,
        heading: 0,
        altitude: 1200,
        zoom: 1,
      });
    }
  }, []);

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
      const prevDistance = Math.hypot(prev.latitude - location.latitude, prev.longitude - location.longitude);
      const currDistance = Math.hypot(curr.latitude - location.latitude, curr.longitude - location.longitude);
      return currDistance < prevDistance ? curr : prev;
    });
  };

  const calculateDistance = (point1, point2) => {
    return Math.hypot(point2.latitude - point1.latitude, point2.longitude - point1.longitude);
  };

  const dijkstra = (start, end, graph) => {
    const distances = {};
    const visited = {};
    const previous = {};
    const queue = [];

    for (let point of graph) {
      distances[point.reference] = Infinity;
      previous[point.reference] = null;
      queue.push(point);
    }
    distances[start.reference] = 0;

    while (queue.length > 0) {
      queue.sort((a, b) => distances[a.reference] - distances[b.reference]);
      const current = queue.shift();

      if (current.reference === end.reference) break;
      if (distances[current.reference] === Infinity) break;

      const currentIndex = graph.indexOf(current);
      const neighbors = [];
      if (currentIndex > 0) neighbors.push(graph[currentIndex - 1]);
      if (currentIndex < graph.length - 1) neighbors.push(graph[currentIndex + 1]);

      for (let neighbor of neighbors) {
        if (visited[neighbor.reference]) continue;

        const alt = distances[current.reference] + calculateDistance(current, neighbor);
        if (alt < distances[neighbor.reference]) {
          distances[neighbor.reference] = alt;
          previous[neighbor.reference] = current;
        }
      }
      visited[current.reference] = true;
    }

    const path = [];
    let step = end;
    while (previous[step.reference]) {
      path.unshift(step);
      step = previous[step.reference];
    }
    path.unshift(start);
    return path;
  };

  const handleSearch = () => {
    const destinationPoint = polylineCoordinates.find(point => point.reference === searchQuery.toUpperCase());
    if (destinationPoint) {
      setDestination(destinationPoint);

      // Find the nearest points on the polyline to the current location and destination
      const startNearestPoint = findNearestPoint(currentLocation, polylineCoordinates);
      const endNearestPoint = findNearestPoint(destinationPoint, polylineCoordinates);

      // Generate the route using Dijkstra's algorithm
      const path = dijkstra(startNearestPoint, endNearestPoint, polylineCoordinates);
      setRouteCoordinates([currentLocation, ...path, destinationPoint]);
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
        {polylineCoordinates.map((point, index) => (
          <Marker
            key={index}
            coordinate={point}
            title={`Point ${point.reference}`}
            description={`Latitude: ${point.latitude}, Longitude: ${point.longitude}`}
          />
        ))}
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

export default Map;
