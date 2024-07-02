import React, { Component } from 'react'
import { View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native'

import { styles } from '../../styles/light/HomeCards'

export default class HomeCards extends Component {
    render() {
        return(
            <View style={styles.card}>
                <Text style={styles.period}> {this.props.info.id} Period </Text>
                <Text style={styles.list}> Class: {this.props.info.className} </Text>
                <Text style={styles.list}> Teacher: {this.props.info.teacher} </Text>
                <Text style={styles.list}> Building: {this.props.info.building} </Text>
                <Text style={styles.list}> Room: {this.props.info.roomNumber} </Text>

            </View>
        );
    }
}
