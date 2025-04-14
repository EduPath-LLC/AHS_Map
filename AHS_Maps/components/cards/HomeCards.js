import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { stylesLight } from '../../styles/light/HomeCardsLight';
// import { stylesDark } from '../../styles/dark/HomeCardsDark';

export default class HomeCards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            styles: stylesLight,
            ahs: [
                { id: "First", value: "8:45 - 9:37" },
                { id: "Second", value: "9:43 - 11:16" },
                { id: "Third", value: "11:22 - 1:28" },
                { id: "Fourth", value: "1:35 - 3:08" },
                { id: "Fifth", value: "9:43 - 11:16" },
                { id: "Sixth", value: "11:22 - 1:28" },
                { id: "Seventh", value: "1:35 - 3:08" },
                { id: "Eight", value: "3:14 - 4:05" },
            ],
            steam: [
                { id: "First", value: "8:14 - 9:08" },
                { id: "Second", value: "9:25 - 10:58" },
                { id: "Third", value: "11:39 - 1:12" },
                { id: "Fourth", value: "2:00 - 3:33" },
                { id: "Fifth", value: "9:25 - 10:58" },
                { id: "Sixth", value: "11:39 - 1:12" },
                { id: "Seventh", value: "2:00 - 3:33" },
            ],
            lowery: [
                { id: "First", value: "8:45 - 9:37" },
                { id: "Second", value: "9:43 - 10:35" },
                { id: "Third", value: "11:28 - 1:28" },
                { id: "Fourth", value: "1:35 - 3:08" },
                { id: "Fifth", value: "10:41 - 11:22" },
                { id: "Sixth", value: "11:22 - 1:28" },
                { id: "Seventh", value: "1:35 - 3:08" },
                { id: "Eight", value: "3:14 - 4:05" },
            ]
        };
    }

    getTimeForPeriod(period, building) {

        var periodTime;

        if(building == "Allen High School"){
            periodTime = this.state.ahs.find(item => item.id === period);
        }

        if(building == "Lowery Freshman Center"){
            periodTime = this.state.lowery.find(item => item.id === period);
        }

        if(building == "STEAM Center"){
            periodTime = this.state.steam.find(item => item.id === period);
        }
        return periodTime ? periodTime.value : "Time not found";
    }

    render() {
        const { id, className, teacher, building, roomNumber } = this.props.info;
        const time = this.getTimeForPeriod(id, building);

        return (
            <View style={this.state.styles.card}>
                <Text style={this.state.styles.period}>{id} Period</Text>
                <Text style={this.state.styles.time}>{time}</Text>
                <Text style={this.state.styles.list}>Class: {className}</Text>
                <Text style={this.state.styles.list}>Teacher: {teacher}</Text>
                <Text style={this.state.styles.list}>Building: {building}</Text>
                <Text style={this.state.styles.list}>Room: {roomNumber}</Text>
            </View>
        );
    }
}
