import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'

// Get 1% of the width and height
const width = Dimensions.get('window').width * 0.01;
const height = Dimensions.get('window').height * 0.01;


export const styles = StyleSheet.create({
    password: {
        width: 80 * width,
        height: 7 * height,
        padding: 3 * width,
        borderRadius: 2 * width,
        backgroundColor: "#FFFFFF",
        margin: 2 * height
    }
})