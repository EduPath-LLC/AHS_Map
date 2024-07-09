import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'

// Get 1% of the width and height
const width = Dimensions.get('window').width * 0.01;
const height = Dimensions.get('window').height * 0.01;


export const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        width: 70 * width,
        height: 45 * height,
        borderRadius: 10 * width,
        alignSelf: 'center'
    },
    period: {
        fontFamily: 'Kanit-Bold',
        fontSize: 7 * width,
        textAlign: 'center',
        marginTop: height
    },
    input: {
        width: 60 * width,
        height: 7 * height,
        padding: 3 * width,
        borderRadius: 5 * width,
        backgroundColor: "#FFFFFF",
        margin: height,
        alignSelf: 'center'
    }
})