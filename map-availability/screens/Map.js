import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Polyline,  Marker} from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';

export default function Map() {
  const [region, setRegion] = useState({
    latitude: 33.150722,
    longitude: -96.69532,
    latitudeDelta: 0.0000589,
    longitudeDelta: 0.0000004,
  });
  useEffect(() => {
    // Set the initial camera with a heading of 45 degrees
    mapRef.current.animateCamera({
      center: {
        latitude: 33.1505,
        longitude: -96.6934,
      },
      pitch: 0,
      heading: 0, 
      altitude: 1200,
      zoom: 1,
    });
  }, []);

  const mapRef = React.useRef(null);
  const minLatitude = 32;
  const maxLatitude = 33.3;
  const minLongitude = -97.0;
  const maxLongitude = -96.3;

  const onRegionChange = (newRegion) => {
    // Check if the new region is within bounds
    if (
      newRegion.latitude < minLatitude ||
      newRegion.latitude > maxLatitude ||
      newRegion.longitude < minLongitude ||
      newRegion.longitude > maxLongitude
    ) {
      // If the new region is out of bounds, adjust it to stay within bounds
      const adjustedRegion = {
        ...region,
        latitude: Math.min(Math.max(newRegion.latitude, minLatitude), maxLatitude),
        longitude: Math.min(Math.max(newRegion.longitude, minLongitude), maxLongitude),
      };
      setRegion(adjustedRegion);
    } else {
      // If the new region is within bounds, update the region state
      setRegion(newRegion);
    }
  };

  // Define the polyline coordinates
  const polylineCoordinates = [
    { latitude: 33.148972, longitude: -96.695055 }, // 33°08'56.3"N 96°41'42.2"W
    { latitude: 33.151361, longitude: -96.695055 }, // 33°09'04.9"N 96°41'42.2"W
    { latitude: 33.151417, longitude: -96.691777 }, // 33°09'05.1"N 96°41'30.4"W
    { latitude: 33.149250, longitude: -96.691777 }, // 33°08'57.3"N 96°41'30.4"W
    { latitude: 33.149222, longitude: -96.692694 }, // 33°08'57.2"N 96°41'33.7"W
    { latitude: 33.148944, longitude: -96.692694 }, // 33°08'56.4"N 96°41'33.7"W
    { latitude: 33.148972, longitude: -96.695055 }, // 33°08'56.3"N 96°41'42.2"W
  ];
  

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        region={region}
        onRegionChange={onRegionChange}
        showsPointsOfInterest={false}
        // scrollEnabled={false}
        showsUserLocation={true}
        zoomEnabled={false}
        showsCompass={false}
        rotateEnabled={false}
        ref={mapRef}
        
      >
        
        {/* Add the Polyline component */}
        <Polyline
          coordinates={polylineCoordinates}
          strokeColor="#07AFF0" 
          strokeWidth={10} 
        />
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
  map: {

    width: windowWidth * 1, 
    height: windowHeight * 0.7, 
    marginVertical:90
  },
});