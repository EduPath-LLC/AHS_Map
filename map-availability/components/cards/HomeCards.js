import React, { Component } from 'react'
import { View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { styles } from '../../styles/light/CardInputsLight'

export default class HomeCards extends Component {
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
        if(this.state.arr.id != 'Lunch'){
            return (

                <View style={styles.card}>
                    <Text style={styles.period}> {this.state.arr.id} Period </Text>



                    <TextInput
                        style={styles.input}
                        placeholder="Class Name"
                        value={this.state.arr.className}
                        onChangeText={(value) => this.handleInputChange('className', value)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Teacher Last Name"
                        value={this.state.arr.teacher}
                        onChangeText={(value) => this.handleInputChange('teacher', value)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Building"
                        value={this.state.arr.building}
                        onChangeText={(value) => this.handleInputChange('building', value)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Room Number"
                        value={this.state.arr.roomNumber}
                        onChangeText={(value) => this.handleInputChange('roomNumber', value)}
                    />

                </View>
            );
        } else {
            return(
                <View style={styles.card}>
                    <Text style={styles.period}> {this.state.arr.id} Period </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="A Day Lunch"
                        value={this.state.arr.a_day}
                        onChangeText={(value) => this.handleInputChange('a_day', value)}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="B Day Lunch"
                        value={this.state.arr.b_day}
                        onChangeText={(value) => this.handleInputChange('b_day', value)}
                    />

                </View>
            )
        }
    }
}
