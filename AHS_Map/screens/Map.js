import React, {useState, useEffect} from 'react';
import MapView, {Marker, targetLocation, showsMyLocationButton, showsUserLocation, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, StatusBar, TextInput, Alert} from 'react-native';


export default function Map() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 33.10940,
    longitude: -96.66068,
    latitudeDelta: .172,
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
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyle} 
          showsUserLocation={true}
          showsMyLocationButton={true}
          minZoomLevel={17}  
        maxZoomLevel={20} 
        style={styles.map} 
          initialRegion={{
            latitude: mapRegion.latitude,
            longitude: mapRegion.longitude,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0421,
            
          }}>
          
          <Marker coordinate={{latitude: 33.10940, longitude: -96.66068}}/>

          <Polyline 
          coordinates={[mapRegion, {latitude: 33.1100, longitude: -96.66162}]}
          strokeColor= 'blue'
          strokeWidth= '6'
          />

          <Marker 
          coordinate={{latitude: 33.1100, longitude: -96.66162}}
          pinColor='green'
          />

        
        </MapView>

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
    "featureType": "landscape.man_made",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "weight": 8
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "poi.school",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.school",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "weight": 8
      }
    ]
  },
  {
    "featureType": "poi.school",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#94a7cc"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "poi.school",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.school",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.school",
    "elementType": "labels.text.fill",
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
    backgroundColor: "white"
  },
  map: {
    width: '100%',
    height: '60%',
  },
  titlez: {
    fontSize: 40,
    //fontWeight: 'bold',
    color: 'blue',
    alignSelf: "center",
    marginBottom: 20,
    fontWeight: '300',
  },
  titlem: {
    margin: 20,
    paddingVertical: 8,
    //borderWidth: 4,
    borderColor: 'white',
    borderRadius: 6,
    color: 'blue',
    textAlign: 'center',
    fontSize: 30,
    //fontWeight: 'bold',
    //fontStyle: 'italic',
    fontWeight: '700',
  },
  choose: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 10,
  },
  text: {
    fontSize: 15,
    alignSelf: "center",
    top: -40,
    left: 80,
  },
  input: {
    backgroundColor: "#cfcfcf",
    borderColor: 'blue',
    marginRight: 0,
    borderRadius: 5,
    width: 175,
    height: 30,
    fontSize: 10,
    padding: 5,
    alignSelf: "center",
    left: -102.5,
  }
})
