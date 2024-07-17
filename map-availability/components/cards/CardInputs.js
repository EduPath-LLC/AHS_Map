import React, { Component } from 'react'
import { View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { stylesLight } from '../../styles/light/CardInputsLight'
import { stylesDark } from '../../styles/dark/CardInputsDark'
import { Dropdown } from 'react-native-element-dropdown';


export default class CardInputs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arr: {},
            styles: this.props.dark ? stylesDark : stylesLight,
            lunchOptions: [
                { label: 'A Lunch', value: 'A' },
                { label: 'B Lunch', value: 'B' },
                { label: 'C Lunch', value: 'C' },
                { label: 'D Lunch', value: 'D' },
            ]
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

                <View style={this.state.styles.card}>
                    <Text style={this.state.styles.period}> {this.state.arr.id} Period </Text>



                    <TextInput
                        style={this.state.styles.input}
                        placeholder="Class Name"
                        value={this.state.arr.className}
                        onChangeText={(value) => this.handleInputChange('className', value)}
                    />

                    <TextInput
                        style={this.state.styles.input}
                        placeholder="Teacher Last Name"
                        value={this.state.arr.teacher}
                        onChangeText={(value) => this.handleInputChange('teacher', value)}
                    />

                    <TextInput
                        style={this.state.styles.input}
                        placeholder="Building"
                        value={this.state.arr.building}
                        onChangeText={(value) => this.handleInputChange('building', value)}
                    />

                    <TextInput
                        style={this.state.styles.input}
                        placeholder="Room Number"
                        value={this.state.arr.roomNumber}
                        onChangeText={(value) => this.handleInputChange('roomNumber', value)}
                    />

                </View>
            );
        } else {
            return(
                <View style={this.state.styles.card}>
                    <Text style={this.state.styles.period}> {this.state.arr.id} Period </Text>

                    {/* <TextInput
                        style={this.state.styles.input}
                        placeholder="A Day Lunch"
                        value={this.state.arr.a_day}
                        onChangeText={(value) => this.handleInputChange('a_day', value)}
                    /> */}
                    <Dropdown
                        style={this.state.styles.dropdown}
                        placeholderStyle={this.state.styles.placeholderStyle}
                        selectedTextStyle={this.state.styles.selectedTextStyle}
                        data={this.state.lunchOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Select A Day Lunch"
                        value={this.state.arr.a_day}
                        onChange={(item) => this.handleInputChange('a_day', item.value)}
                    />

                    <Dropdown
                        style={this.state.styles.dropdown}
                        placeholderStyle={this.state.styles.placeholderStyle}
                        selectedTextStyle={this.state.styles.selectedTextStyle}
                        data={this.state.lunchOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Select B Day Lunch"
                        value={this.state.arr.b_day}
                        onChange={(item) => this.handleInputChange('b_day', item.value)}
                    />

                </View>
            )
        }
    }
}
