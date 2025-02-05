import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'

// Get 1% of the width and height
const width = Dimensions.get('window').width * 0.01;
const height = Dimensions.get('window').height * 0.01;

export const stylesLight = StyleSheet.create({
    container: {
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
        padding: 3 * width,
    },
    button: {
        alignSelf: 'center',
        margin: 2 * height,
        backgroundColor: '#F66060',
        width: 35 * width,
        height: 5 * height,
        borderRadius: 5 * width,
        alignItems:'center',
        justifyContent:'center'
    },
    buttonText: {
        color: '#FFFFFF',
    },
    modalBackground: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 1)",
        position: "absolute",
        top: 50,
        left: 75,
        right: 75,
        bottom: 100,
        borderRadius: 25,
    },
    classHeading: {
        fontSize: 23,
        fontWeight: "bold",
        margin: 25
    },
    inputClass: {
        display: 'flex',
        flexDirection: 'row',
        padding: 25,
        alignItems: 'center'
    },
    from: {
        fontSize: 15,
        fontWeight: "bold",
    },
    classInput: {
        borderColor: "rgb(0, 0, 0)",
        borderWidth: 1,
        width: 75,
        height: 25,
        borderRadius: 10,
        margin: 25,
        padding: 5,
    },
    carouselText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    noSchool: {
        fontWeight: "bold",
        fontSize: 17,
        margin: 30,
        textAlign: "center",

    },
    buttonCancel: {
        alignSelf: 'center',
        backgroundColor: 'rgb(0, 99, 192)',
        width: 20 * width,
        height: 3 * height,
        borderRadius: 5 * width,
        alignItems:'center',
        justifyContent:'center'
    },
});