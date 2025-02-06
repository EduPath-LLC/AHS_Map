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
            classOptions: [
                { label: 'Physics', value: 'Physics' },
                { label: 'English', value: 'English' },
                { label: 'Calculus', value: 'Calculus' },
            ],
            teacherOptions: [
                { label: 'Bob Ross', value: 'Bob Ross' },
                { label: 'Steve Jobs', value: 'Steve Jobs' },
                { label: 'Linus Torvalds', value: 'Linus Torvalds' },
            ],
            roomOptions: [
                { label: 'F108', value: 'F108' },
                { label: 'F111', value: 'F111' },
                { label: 'F110', value: 'F110' },
                { label: 'F112', value: 'F112' },
                { label: 'F114', value: 'F114' },
                { label: 'F115', value: 'F115' },
                { label: 'F116', value: 'F116' },
                { label: 'F117', value: 'F117' },
                { label: 'F120', value: 'F120' },
                { label: 'F119', value: 'F119' },
                { label: 'S18', value: 'S18' },
                { label: 'F123', value: 'F123' },
                { label: 'F124', value: 'F124' },
                { label: 'F125', value: 'F125' },
                { label: 'F126', value: 'F126' },
                { label: 'F128', value: 'F128' },
                { label: 'F129', value: 'F129' },
                { label: 'F130', value: 'F130' },
                { label: 'F133', value: 'F133' },
                { label: 'F136', value: 'F136' },
                { label: 'F138', value: 'F138' },
                { label: 'F140', value: 'F140' },
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



                    <Dropdown
                        style={stylesLight.dropdown}
                        placeholderStyle={stylesLight.placeholderStyle}
                        selectedTextStyle={stylesLight.selectedTextStyle}
                        data={this.state.classOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Class Name"
                        value={this.state.arr.className}
                        search
                        onChange={(item) => this.handleInputChange('className', item.value)}
                    />

                    <Dropdown
                        style={stylesLight.dropdown}
                        placeholderStyle={stylesLight.placeholderStyle}
                        selectedTextStyle={stylesLight.selectedTextStyle}
                        data={this.state.teacherOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Teacher Name"
                        value={this.state.arr.teacher}
                        search
                        onChange={(item) => this.handleInputChange('teacher', item.value)}
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

                    <Dropdown
                        style={stylesLight.dropdown}
                        placeholderStyle={stylesLight.placeholderStyle}
                        selectedTextStyle={stylesLight.selectedTextStyle}
                        data={this.state.roomOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Room Number"
                        value={this.state.arr.roomNumber}
                        search
                        onChange={(item) => this.handleInputChange('roomNumber', item.value)}
                    />

                </View>
            );
        } else {
            return(
                <View style={stylesLight.card}>
                    <Text style={stylesLight.period}> {this.state.arr.id} </Text>

                    {/* <TextInput
                        style={stylesLight.input}
                        placeholder="A Day Lunch"
                        value={this.state.arr.a_day}
                        onChangeText={(value) => this.handleInputChange('a_day', value)}
                    /> */}
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
