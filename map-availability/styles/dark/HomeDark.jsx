import { StyleSheet, Dimensions } from 'react-native';

// Get 1% of the width and height
const width = Dimensions.get('window').width * 0.01;
const height = Dimensions.get('window').height * 0.01;


export const stylesDark = StyleSheet.create({
    fullScreen: {
        flex: 1,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 10 * height,
        backgroundColor: "#001C2D",
        marginTop: 15 * height
    },
    bigText: {
        fontSize: 10 * width,
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: 'Kanit-Bold',
        color: "#FFFFFF"
    }
});
