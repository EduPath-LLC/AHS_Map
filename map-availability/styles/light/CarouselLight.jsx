import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'

// Get 1% of the width and height
const width = Dimensions.get('window').width * 0.01;
const height = Dimensions.get('window').height * 0.01;


export const stylesLight = StyleSheet.create({
    container: {
        display: 'flex'
    },
    viewer: {
        flexDirection: 'row'
    },
    image: {
        width: 7 * width,
        height: 10 * width,
    },
    arrows: {
        alignSelf: 'center',
        margin: 3 * width,
    },
    button: {
        alignSelf: 'center',
        margin: 5 * height,
        backgroundColor: '#F66060',
        width: 35 * width,
        height: 5 * height,
        borderRadius: 5 * width,
        alignItems:'center',
        justifyContent:'center'
    },
    buttonText: {
        color: '#FFFFFF',
    }
})