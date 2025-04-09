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
