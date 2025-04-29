import { StyleSheet, Dimensions } from 'react-native';

// Get 1% of the width and height
const width = Dimensions.get('window').width * 0.01;
const height = Dimensions.get('window').height * 0.01;


export const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 10 * height,
        backgroundColor: "#E0EDFC",
        marginTop: 15 * height
    },
    bigText: {
        fontSize: 10 * width,
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: 'Kanit-Bold'
    },
    input: {
      width: '80%',
      marginVertical: 10,
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingVertical: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    
    textInput: {
      fontSize: 16,
      letterSpacing: 4, // This spreads out PIN digits for better visibility
    },
    
    switchAuthButton: {
      marginTop: 10,
      padding: 10,
    },
    
    switchAuthText: {
      color: '#4A90E2',
      textAlign: 'center',
      fontSize: 14,
    },
    button: {
        backgroundColor: '#574BE5',
        width: 80 * width,
        height: 7 * height,
        borderRadius: 2 * width,
        margin: 2 * height,
        justifyContent: 'center',
      },
      buttonText: {
        color: 'white',
        alignSelf: 'center',
      },
      return: {
        color: '#2028DE'
      }
});
