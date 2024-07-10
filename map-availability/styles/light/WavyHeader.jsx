import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';

// Get 1% of the width and height
const width = Dimensions.get('window').width * 0.01;
const height = Dimensions.get('window').height * 0.01;

export const styles = StyleSheet.create({
    svgCurve: {
        position: 'absolute',
        width: 100 * width,
        zIndex: 500,
    },
    logo: {
        alignSelf: 'center',
        marginTop: 7 * height,
    }
});
