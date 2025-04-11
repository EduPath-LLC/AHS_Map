import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown'; // Import Dropdown
import { stylesLight } from '../../styles/light/CardInputsLight';

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
        const buildingOptions = [
            { label: 'Allen High School', value: 'Allen High School' },
            { label: 'Lowery Freshman Center', value: 'Lowery Freshman Center' },
            { label: 'STEAM Center', value: 'STEAM Center' },
        ];

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

                {/* Replace Picker with Dropdown */}
                <Dropdown
                    style={stylesLight.input}
                    data={buildingOptions}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Building"
                    value={this.state.arr.building}
                    onChange={(item) => this.handleInputChange('building', item.value)}
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