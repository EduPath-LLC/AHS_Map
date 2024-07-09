import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';

// Get 1% of the width and height
const width = Dimensions.get('window').width * 0.01;
const height = Dimensions.get('window').height * 0.01;

export const styles = StyleSheet.create({
    svgCurve: {
        width: 100 * width,
        height: 20 * height,
        zIndex: 500,
    },
    logo: {
        alignSelf: 'center',
        marginTop: 7 * height,
        width: 25 * width,
        height: 25 * width,
    }
});
