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
      flexDirection: 'row',
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
      flex: 1,
      height: 50,
      paddingHorizontal: 20,
      fontSize: 16,
    },
    button: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 20,
      justifyContent: 'center',
      borderTopRightRadius: 25,
      borderBottomRightRadius: 25,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    directionsContainer: {
      marginTop: 10,
      marginHorizontal: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 15,
      padding: 15,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    directionsContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    directionsText: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      textShadowColor: 'white',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
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
      marginBottom: 10,
      textAlign: 'center',
    },
    exitButton: {
      backgroundColor: '#FF3B30',
      paddingVertical: 10,
      borderRadius: 20,
      alignItems: 'center',
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
    historyContainer: {
      backgroundColor: 'white',
      marginHorizontal: 20,
      padding: 10,
      borderRadius: 5,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      alignContent: 'center',
      maxHeight: 25 * height,
      marginTop: width,
    },
    historyItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
    },
    historyItemTextContainer: {
      flex: 1,
      width: 50 * width
    },
    historyItemText: {
      fontSize: 16,
    },
    
  });