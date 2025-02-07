import React, { Component } from 'react'
import { View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { stylesLight } from '../../styles/light/CardInputsLight'
import { Dropdown } from 'react-native-element-dropdown';
import { validateBBox } from '@turf/turf';


export default class CardInputs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arr: {},
            lunchOptions: [
                { label: 'A Lunch', value: 'A Lunch' },
                { label: 'B Lunch', value: 'B Lunch' },
                { label: 'C Lunch', value: 'C Lunch' },
                { label: 'D Lunch', value: 'D Lunch' },
                { label: 'STEAM Lunch', value: 'STEAM Lunch'},
            ],
            buildingOptions: [
                { label: 'Allen High School', value: 'Allen High School' },
                { label: 'STEAM Center', value: 'STEAM Center' },
                { label: 'Lowery Freshman Center', value: 'Lowery Freshman Center' },
            ],
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

                <View style={stylesLight.card}>
                    <Text style={stylesLight.period}> {this.state.arr.id} Period </Text>



                    <TextInput
                        style={stylesLight.dropdown}
                        placeholder="Class Name"
                        value={this.state.arr.className}
                        onChange={(item) => this.handleInputChange('className', item.value)}
                    />

                    <TextInput
                        style={stylesLight.dropdown}
                        placeholder="Teacher Name"
                        value={this.state.arr.teacher}
                        onChange={(item) => this.handleInputChange('teacher', item.value)}
                    />

                    <TextInput
                        style={stylesLight.dropdown}
                        placeholder="Room Number"
                        value={this.state.arr.roomNumber}
                        onChange={(item) => this.handleInputChange('roomNumber', item.value)}
                    />

                    <Dropdown
                        style={stylesLight.dropdown}
                        placeholderStyle={stylesLight.placeholderStyle}
                        selectedTextStyle={stylesLight.selectedTextStyle}
                        data={this.state.buildingOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Building"
                        value={this.state.arr.building}
                        onChange={(item) => this.handleInputChange('building', item.value)}
                    />



                </View>
            );
        } else {
            return(
                <View style={stylesLight.card}>
                    <Text style={stylesLight.period}> {this.state.arr.id} </Text>
                    <Dropdown
                        style={stylesLight.dropdown}
                        placeholderStyle={stylesLight.placeholderStyle}
                        selectedTextStyle={stylesLight.selectedTextStyle}
                        data={this.state.lunchOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Select A Day Lunch"
                        value={this.state.arr.a_day}
                        onChange={(item) => this.handleInputChange('a_day', item.value)}
                    />

                    <Dropdown
                        style={stylesLight.dropdown}
                        placeholderStyle={stylesLight.placeholderStyle}
                        selectedTextStyle={stylesLight.selectedTextStyle}
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
