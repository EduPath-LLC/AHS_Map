import React, {useState, useEffect} from 'react';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, StatusBar, TextInput} from 'react-native';
import { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';


export default function Map() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 33.1076,
    longitude: -96.662948,
    latitudeDelta: .003172,
    longitudeDelta: .004034
    
  });
 
  return (
    <View style={styles.container}>

      <StatusBar
         barStyle = "dark-content" 
         backgroundColor = "#3091BE" 
         translucent = {true}
      />

      <View style={{marginTop: 25}}>

      <Text style={styles.titlem}>AHS Map and Availibilty</Text>
      <Text style={styles.titlez}> Map </Text>

      <View style={styles.choose}>
        <Text style={styles.text} > Where do you want to go? </Text>
        <TextInput style={styles.input} />
      </View>

      <MapView 
        customMapStyle={mapStyle} 
        style={styles.map} 
        region={mapRegion}
      />

      </View>
      
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
    backgroundColor: "#3091BE"
  },
  map: {
    width: '100%',
    height: '70%',
  },
  titlez: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: "center",
    marginBottom: 20
  },
  titlem: {
    margin: 20,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 6,
    color: 'white',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  choose: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 10,
    padding: 10,
  },
  text: {
    fontSize: 15,
  },
  input: {
    backgroundColor: "white",
    marginHorizontal: 5,
    borderRadius: 5,
    width: 200,
    height: 30,
    fontSize: 10
  }
})
