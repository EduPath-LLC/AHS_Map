import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TextInput, Button, Text, ScrollView } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const Map = () => {
  const [region, setRegion] = useState({
    latitude: 33.150083,
    longitude: -96.695083,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [directions, setDirections] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        setIsLoading(false);
        return;
      }

      getCurrentPosition();
    })();
  }, []);

  const getCurrentPosition = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setCurrentLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error getting location:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let locationSubscription;

    (async () => {
      locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 10000, distanceInterval: 10 },
        (location) => {
          const { latitude, longitude } = location.coords;
          setCurrentLocation({ latitude, longitude });
        }
      );
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
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

  const findNearestPointOnLine = (point, lineStart, lineEnd) => {
    const dx = lineEnd.longitude - lineStart.longitude;
    const dy = lineEnd.latitude - lineStart.latitude;
    const t = ((point.longitude - lineStart.longitude) * dx + (point.latitude - lineStart.latitude) * dy) / (dx * dx + dy * dy);
    const clampedT = Math.max(0, Math.min(1, t));
    return {
      latitude: lineStart.latitude + clampedT * dy,
      longitude: lineStart.longitude + clampedT * dx
    };
  };

  const calculateDistance = (point1, point2) => {
    const R = 6371000; // radius of Earth in meters
    const lat1 = point1.latitude * Math.PI / 180;
    const lat2 = point2.latitude * Math.PI / 180;
    const deltaLat = (point2.latitude - point1.latitude) * Math.PI / 180;
    const deltaLon = (point2.longitude - point1.longitude) * Math.PI / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  };

  const buildGraph = (coordinates, currentLocation) => {
    const graph = {};
    let nearestLinePoint = null;
    let minDistance = Infinity;
    let nearestSegmentStart = null;

    for (let i = 0; i < coordinates.length; i++) {
      const start = coordinates[i];
      const end = coordinates[(i + 1) % coordinates.length];
      const nearestPoint = findNearestPointOnLine(currentLocation, start, end);
      const distance = calculateDistance(currentLocation, nearestPoint);
      if (distance < minDistance) {
        minDistance = distance;
        nearestLinePoint = nearestPoint;
        nearestSegmentStart = start;
      }
    }

    const newPointReference = 'current_projected';
    graph['current'] = [{ reference: newPointReference, distance: minDistance }];
    graph[newPointReference] = [
      { reference: 'current', distance: minDistance },
      { reference: nearestSegmentStart.reference, distance: calculateDistance(nearestLinePoint, nearestSegmentStart) },
      { reference: coordinates[(coordinates.indexOf(nearestSegmentStart) + 1) % coordinates.length].reference, 
        distance: calculateDistance(nearestLinePoint, coordinates[(coordinates.indexOf(nearestSegmentStart) + 1) % coordinates.length]) }
    ];

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

      if (point === nearestSegmentStart || point === coordinates[(coordinates.indexOf(nearestSegmentStart) + 1) % coordinates.length]) {
        graph[point.reference].push({
          reference: newPointReference,
          distance: calculateDistance(point, nearestLinePoint)
        });
      }
    });

    return { graph, nearestLinePoint };
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

  const calculateDirections = (routeCoords) => {
    const directions = [];
    for (let i = 1; i < routeCoords.length; i++) {
      const start = routeCoords[i - 1];
      const end = routeCoords[i];
      const bearing = calculateBearing(start, end);
      const distance = calculateDistance(start, end);

      let direction;
      if (bearing >= 337.5 || bearing < 22.5) direction = "north";
      else if (bearing >= 22.5 && bearing < 67.5) direction = "northeast";
      else if (bearing >= 67.5 && bearing < 112.5) direction = "east";
      else if (bearing >= 112.5 && bearing < 157.5) direction = "southeast";
      else if (bearing >= 157.5 && bearing < 202.5) direction = "south";
      else if (bearing >= 202.5 && bearing < 247.5) direction = "southwest";
      else if (bearing >= 247.5 && bearing < 292.5) direction = "west";
      else direction = "northwest";

      directions.push(`Go ${direction} for ${Math.round(distance)} meters`);
    }
    directions.push("You have reached your destination");
    return directions;
  };

  const calculateBearing = (start, end) => {
    const startLat = start.latitude * Math.PI / 180;
    const startLng = start.longitude * Math.PI / 180;
    const endLat = end.latitude * Math.PI / 180;
    const endLng = end.longitude * Math.PI / 180;

    const y = Math.sin(endLng - startLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) -
              Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
  };

  const handleSearch = () => {
    if (!currentLocation) {
      alert("Current location not available. Please try again.");
      return;
    }

    const destinationPoint = polylineCoordinates.find(point => point.reference === searchQuery.toUpperCase());
    if (destinationPoint) {
      setDestination(destinationPoint);

      const { graph, nearestLinePoint } = buildGraph(polylineCoordinates, currentLocation);
      const path = dijkstra('current', destinationPoint.reference, graph);

      const routeCoords = path.map(ref => {
        if (ref === 'current') return currentLocation;
        if (ref === 'current_projected') return nearestLinePoint;
        return polylineCoordinates.find(point => point.reference === ref);
      });

      setRouteCoordinates(routeCoords);
      
      // Calculate and set directions
      const newDirections = calculateDirections(routeCoords);
      setDirections(newDirections);
    } else {
      alert("Invalid destination reference. Please try again.");
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading location...</Text>
        </View>
      ) : (
        <>
          <MapView
            style={styles.map}
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
            {currentLocation && (
              <Marker
                coordinate={currentLocation}
                title="Current Location"
                pinColor="blue"
              />
            )}
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
          <ScrollView style={styles.directionsContainer}>
            {directions.map((direction, index) => (
              <Text key={index} style={styles.directionText}>{direction}</Text>
            ))}
          </ScrollView>
        </>
      )}
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
    height: windowHeight * 0.6,
    marginVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  directionsContainer: {
    width: windowWidth * 0.9,
    maxHeight: windowHeight * 0.2,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  directionText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default Map;
