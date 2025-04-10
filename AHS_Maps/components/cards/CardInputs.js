import React, { Component } from 'react'
import { View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { stylesLight } from '../../styles/light/CardInputsLight'

export default class CardInputs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arr: {}
        };
    }

    componentDidMount() {
        this.setState({ arr: this.props.info });
    }

    handleInputChange = (id, value) => {
        const newObject = { ...this.state.arr };
    
        newObject[id] = value;
    
        this.setState({ arr: newObject });
    
        this.props.onInputChange(newObject);
    };
    

    render() {
        
        return (

            <View style={stylesLight.card}>
                <Text style={stylesLight.period}> {this.state.arr.id} Period </Text>



                <TextInput
                    style={stylesLight.input}
                    placeholder="Class Name"
                    value={this.state.arr.className}
                    onChangeText={(value) => this.handleInputChange('className', value)}
                />

                <TextInput
                    style={stylesLight.input}
                    placeholder="Teacher Last Name"
                    value={this.state.arr.teacher}
                    onChangeText={(value) => this.handleInputChange('teacher', value)}
                />

                <TextInput
                    style={stylesLight.input}
                    placeholder="Building"
                    value={this.state.arr.building}
                    onChangeText={(value) => this.handleInputChange('building', value)}
                />

                <TextInput
                    style={stylesLight.input}
                    placeholder="Room Number"
                    value={this.state.arr.roomNumber}
                    onChangeText={(value) => this.handleInputChange('roomNumber', value)}
                />

            </View>
        );
        
    }
}