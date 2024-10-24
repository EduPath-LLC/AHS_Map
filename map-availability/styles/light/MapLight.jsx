import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'

// Get 1% of the width and height
const width = Dimensions.get('window').width * 0.01;
const height = Dimensions.get('window').height * 0.01;


export  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    searchContainer: {
      flexDirection: 'column',
      marginTop: 50,
      marginHorizontal: 20,
      borderRadius: 25,
      backgroundColor: 'white',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    searchInput: {
      height: 50,
      paddingHorizontal: 20,
      fontSize: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    button: {
      backgroundColor: '#007AFF',
      paddingVertical: 15,
      alignItems: 'center',
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    directionsContainer: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: 10,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      
    },
    directionsInnerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    directionsText: {
      fontSize: 16,
      color: '#333',
      flex: 1,
      alignText: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    turnIcon: {
      marginLeft: 10,
    },
    directionsContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    arrowContainer: {
      width: 24,
      height: 24,
      marginRight: 10,
    },
    arrowVertical: {
      position: 'absolute',
      top: 0,
      left: 11,
      width: 2,
      height: 18,
      backgroundColor: '#007AFF',
    },
    arrowHorizontalLeft: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 12,
      height: 2,
      backgroundColor: '#007AFF',
    },
    arrowHorizontalRight: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 12,
      height: 2,
      backgroundColor: '#007AFF',
    },
    routeInfoContainer: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      right: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 15,
      padding: 15,
      shadowColor: "#000",
      flexDirection: 'column',
      
      
    
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    routeInfoText: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    routeSegment: {
      strokeColor: '#007AFF',
      strokeWidth: 4,
    },
    startingPointMarker: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'green',
      borderColor: 'white',
      borderWidth: 2,
    },
    exitButton: {
      backgroundColor: '#FF3B30',
      paddingVertical: 20,
      borderRadius: 20,
      alignItems: 'center',
      marginBottom: 20
    },
    exitButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
     arrivedMessageContainer: {
       position: 'absolute',
       top: '50%',
       left: 20,
       right: 20,
       backgroundColor: 'rgba(0, 122, 255, 0.9)',
       borderRadius: 15,
       padding: 20,
       alignItems: 'center',
     },
     arrivedMessageText: {
       color: 'white',
       fontSize: 24,
       fontWeight: 'bold',
     },
    disabledMapContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(240, 240, 240, 0.9)',
    },
    disabledMapText: {
      fontSize: 18,
      textAlign: 'center',
      padding: 20,
      color: '#333',
    },
    historyContainer: {
      position: 'absolute',
      top: 250,
      left: 20,
      right: 20,
      backgroundColor: '#FFF',
      borderColor: '#CCC',
      borderWidth: 1,
      zIndex: 1,
      maxHeight: 200,
      overflow: 'scroll',
      alignItems: 'center',
      borderRadius: 30
    },
    historyItem: {
      padding: 10,
      fontSize: 28,
      color: '#000',
      alignItems: 'center',
    },
    customMarker: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'rgba(0, 122, 255, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    markerInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#007AFF',
    },
    
    endSegmentButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 20,
      borderRadius: 20,
      alignItems: 'center',
      marginBottom: 20
    },
    endSegmentButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    floorSwitchContainer: {
      position: 'absolute',
      top: 20,
      right: 20,
      flexDirection: 'row',
    },
    floorButton: {
      backgroundColor: '#fff',
      padding: 10,
      marginHorizontal: 5,
      borderRadius: 5,
    },
    activeFloorButton: {
      backgroundColor: '#007AFF',
    },
    floorButtonText: {
      color: '#000',
    },
    floorToggleButton: {
      backgroundColor: '#007AFF',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      alignSelf: 'center',
      top:-5,
      paddingHorizontal:80
    },
    floorToggleButtonText: {
      color: 'white',
      fontWeight: 'bold',
      top:0
    },
    progressBarContainer: {
      width: '100%',
      height: 5,
      backgroundColor: '#e0e0e0',
      position: 'absolute',
      bottom: 0,
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#007AFF',
    },
    guidanceContainer: {
      fontSize: 16,
      color: '#007AFF',
      marginTop: 400,
    },

  });