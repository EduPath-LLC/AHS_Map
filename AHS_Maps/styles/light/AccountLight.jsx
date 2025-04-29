import { center } from '@turf/turf';
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
        marginTop: 10 * height,
    },
    bigText: {
        fontSize: 10 * width,
        alignItems: 'center',
        textAlign: 'center',
        fontFamily: 'Kanit-Bold',
    },
    button: {
        borderRadius: 9999,
        backgroundColor: '#007AFF',
        width: 50 * width,
        height: 5 * height,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2 * width,
        marginBottom: 2 * width,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 5 * width,
        fontFamily: 'Kanit-Bold',
        textAlign: 'center',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 5 * width,
        paddingVertical: 2 * width,
        width: 35 * width,
        height: 10 * height,
        zIndex: 10000
    },
    backButtonText: {
        fontSize: 5 * width,
        marginLeft: 2 * width,
        fontFamily: 'Kanit-Bold',
        color: 'black',
    },
});
