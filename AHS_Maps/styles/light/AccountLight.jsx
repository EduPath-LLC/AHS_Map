import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'

// Get 1% of the width and height
const width = Dimensions.get('window').width * 0.01;
const height = Dimensions.get('window').height * 0.01;


export const stylesLight = StyleSheet.create({
    fullScreen: {
        flex: 1,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 10 * height,
        backgroundColor: "#E0EDFC",
        marginTop: 10 * height
    },
    bigText: {
        fontSize: 10 * width,
        alignItems: 'center',
        textAlign: 'left',
        fontFamily: 'Kanit-Bold',
    },
    firstNameTextInput: {
        width: 80 * width,
        height: 7 * height,
        padding: 3 * width,
        borderRadius: 2 * width,
        backgroundColor: "#FFFFFF",
        margin: 2 * height,
        placeholder: "First Name"
    },
    toggleSwitch: {
        alignSelf: 'flex-end',
        marginLeft: 40 * width,
        marginBottom: 2 * width,
        
    },
    normalText: {
        fontSize: 5 * width,
        alignSelf: 'flex-start',
        textAlign: 'left',
        fontFamily: 'Kanit-Bold',
        // marginRight: 40 * width,
        marginBottom: 2 * width,
    },
    button: {
        borderRadius: 9999,
        backgroundColor: '#007AFF',
        width: 50 * width,
        height: 5 * height,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        marginTop: 2 * width,
        marginBottom: 2 * width,
    },
    buttonNew: {
        flexDirection: 'row',
        width: 80 * width,
        height: 7 * height,
        justifyContent: 'space-around',
        borderBottomColor: 'gray',
        padding: width,
        right: 10 * width
    },
    buttonText: {
        color: '#FFFFFF',
        width: 50 * width,
        alignSelf: 'center',
        fontSize: 5 * width,
        fontFamily: 'Kanit-Bold',
        alignContent: 'center',
        textAlign: 'center',
    },
    buttonNewText: {
        color: '#000000',
        width: 60 * width,
        alignSelf: 'flex-end',
        fontSize: 5 * width,
        fontFamily: 'Kanit-Bold',
        alignContent: 'flex-start',
        textAlign: 'flex-start',
        marginLeft: -7 * width,
    },
    imageStyle: {
        width: 7.5 * width,
        height: 7.5 * width,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'left',
        alignContent: 'flex-start',
        alignSelf: 'flex-end',
    },
    imageArrowStyle: {
        width: 5 * width,
        height: 7.5 * width,
        alignSelf: 'flex-end',
    }
})
