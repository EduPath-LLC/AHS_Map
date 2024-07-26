                import React, { Component } from 'react'
                import { View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
                import { stylesLight } from '../../styles/light/CardInputsLight'
                import { stylesDark } from '../../styles/dark/CardInputsDark'
                import { Dropdown } from 'react-native-element-dropdown';
import { validateBBox } from '@turf/turf';


                export default class CardInputs extends Component {
                    constructor(props) {
                        super(props);
                        this.state = {
                            arr: {},
                            styles: this.props.dark ? stylesDark : stylesLight,
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
                                { label: 'E', value: 'E' },
                                { label: 'F', value: 'F' },
                                { label: 'A', value: 'A' },
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

                                <View style={this.state.styles.card}>
                                    <Text style={this.state.styles.period}> {this.state.arr.id} Period </Text>



                                    <Dropdown
                                        style={this.state.styles.dropdown}
                                        placeholderStyle={this.state.styles.placeholderStyle}
                                        selectedTextStyle={this.state.styles.selectedTextStyle}
                                        data={this.state.classOptions}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Class Name"
                                        value={this.state.arr.className}
                                        search
                                        onChange={(item) => this.handleInputChange('className', item.value)}
                                    />

                                    <Dropdown
                                        style={this.state.styles.dropdown}
                                        placeholderStyle={this.state.styles.placeholderStyle}
                                        selectedTextStyle={this.state.styles.selectedTextStyle}
                                        data={this.state.teacherOptions}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Teacher Name"
                                        value={this.state.arr.teacher}
                                        search
                                        onChange={(item) => this.handleInputChange('teacher', item.value)}
                                    />

                                    <Dropdown
                                        style={this.state.styles.dropdown}
                                        placeholderStyle={this.state.styles.placeholderStyle}
                                        selectedTextStyle={this.state.styles.selectedTextStyle}
                                        data={this.state.buildingOptions}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Building"
                                        value={this.state.arr.building}
                                        onChange={(item) => this.handleInputChange('building', item.value)}
                                    />

                                    <Dropdown
                                        style={this.state.styles.dropdown}
                                        placeholderStyle={this.state.styles.placeholderStyle}
                                        selectedTextStyle={this.state.styles.selectedTextStyle}
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
                                <View style={this.state.styles.card}>
                                    <Text style={this.state.styles.period}> {this.state.arr.id} </Text>

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
