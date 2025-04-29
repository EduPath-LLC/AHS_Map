import { StyleSheet, Dimensions, Platform } from 'react-native'

const width = Dimensions.get('window').width * 0.01;
const height = Dimensions.get('window').height * 0.01;

export const stylesLight = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: '#E0EDFC',
    },
    container: {
        flex: 1,
        paddingTop: 25 * height,
        paddingHorizontal: 5 * width,
    },
    bigText: {
        fontSize: 8 * width,
        fontFamily: 'Kanit-Bold',
        marginBottom: 4 * height,
        color: '#000',
    },
    buttonNew: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 3 * width,
        paddingVertical: 2 * height,
        paddingHorizontal: 4 * width,
        marginBottom: 3 * height,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: Platform.OS === 'android' ? 3 : 0,
    },
    buttonNewText: {
        flex: 1,
        fontSize: 5 * width,
        fontFamily: 'Kanit-Bold',
        marginLeft: 4 * width,
        color: '#333333',
    },
    imageStyle: {
        width: 8 * width,
        height: 8 * width,
        resizeMode: 'contain',
    },
    imageArrowStyle: {
        width: 4 * width,
        height: 4 * width,
        resizeMode: 'contain',
        tintColor: '#999',
    },
});
