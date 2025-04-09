import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'

// Get 1% of the width and height
const width = Dimensions.get('window').width * 0.01;
const height = Dimensions.get('window').height * 0.01;


export const stylesLight = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        width: 70 * width,
        height: 45 * height,
        borderRadius: 10 * width,
        alignSelf: 'center',
        marginTop: 2 * height
    },
    period: {
        fontFamily: 'Kanit-Bold',
        fontSize: 7 * width,
        textAlign: 'center',
        marginTop: height
    },
    list: {
        fontFamily: 'Kanit-Bold',
        margin: 2 * width,
        fontSize: 2 * height,
        marginTop: 4 * height
    },
    time: {
        fontFamily: 'Kanit-Bold',
        alignSelf: 'center',
        fontSize: 2.5*height,
        color: 'black'
    }
})