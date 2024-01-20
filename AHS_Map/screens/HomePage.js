import React, {useState, useEffect} from 'react';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions,} from 'react-native';
import { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
export default function App() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 33.1076,
    longitude: -96.662948,
    latitudeDelta: .003172,
    longitudeDelta: .004034
    
  });
 
  return (
    <View style={styles.container}>
      <MapView 
      
  customMapStyle={mapStyle} 
      style={styles.map} 
      region={mapRegion}
      />
    </View>
  );
}
mapStyle=[
  {
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  }

})
