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
    directionsInnerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      padding: 10,
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
      backgroundColor: 'rgba(255, 255, 255, 1)',
      borderRadius: 20,
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
    permissionOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
    },
    permissionMessageContainer: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: '80%',
      alignItems: 'center',
    },
    permissionMessageText: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
    },
    permissionButton: {
      backgroundColor: '#007AFF',
      padding: 10,
      borderRadius: 5,
    },
    permissionButtonText: {
      color: 'white',
      fontWeight: 'bold',
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
      marginBottom: 10
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
    distanceOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 01)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    distanceOverlayText: {
      color: 'white',
      fontSize: 18,
      textAlign: 'center',
      padding: 20,
      fontWeight: 'bold',
    },
    historyContainer: {
      position: 'absolute',
      top: 100, // Adjust based on your layout
      left: 20,
      right: 20,
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 10,
      zIndex: 999,
    },
    historyItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
    },
    historyItem: {
      fontSize: 16,
      color: '#333',
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
      marginBottom: 10
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
    directionsText: {
      fontSize: 15,
      color: '#333',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    guidanceContainer: {
      backgroundColor: '#FFFFFF',
      height: 10 * height,
      width: 61 * width,
      alignSelf: 'center',
      marginVertical: 10 * height,
      borderRadius: 5 * width,
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      marginHorizontal: 4 * width
    },
    rotationContainer: {
      backgroundColor: 'white',
      width: 23 * width,
      height: 10 * height,
      marginVertical: 10 * height,
      marginHorizontal: 4 * width,
      borderRadius: 5 * width,
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }

  });