import React, { Component } from 'react'
import { View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native'

import { stylesLight } from '../../styles/light/HomeCardsLight'
import { stylesDark } from '../../styles/dark/HomeCardsDark'

export default class HomeCards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            styles: this.props.dark ? stylesDark : stylesLight,
        };
    }
    render() {
        return(
            <View style={this.state.styles.card}>
                <Text style={this.state.styles.period}> {this.props.info.id} Period </Text>
                <Text style={this.state.styles.list}> Class: {this.props.info.className} </Text>
                <Text style={this.state.styles.list}> Teacher: {this.props.info.teacher} </Text>
                <Text style={this.state.styles.list}> Building: {this.props.info.building} </Text>
                <Text style={this.state.styles.list}> Room: {this.props.info.roomNumber} </Text>

            </View>
        );
    }
}
