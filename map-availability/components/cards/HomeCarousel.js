import React, { Component } from 'react';
import { View, Text, Pressable, Image, Alert } from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { PanGestureHandler, State, TextInput } from 'react-native-gesture-handler';
import dayData from '../../assets/schedule/day.json';

import { stylesLight } from '../../styles/light/HomeCarouselLight';
// import { stylesDark } from '../../styles/dark/HomeCarouselDark';
import HomeCards from './HomeCards';

import ArrowBack from '../../assets/images/ArrowBack.png';
import ArrowBackDark from '../../assets/images/ArrowBackDark.png';
import ArrowForward from '../../assets/images/ArrowForward.png';
import ArrowForwardDark from '../../assets/images/ArrowForwardDark.png';

export default class HomeCarousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            schedule: {},
            first: {},
            second: {},
            third: {},
            fourth: {},
            fifth: {},
            sixth: {},
            seventh: {},
            eighth: {},
            lunch: {},
            loading: false,
            arrowBack: this.props.dark ? ArrowBackDark : ArrowBack,
            arrowForward: this.props.dark ? ArrowForwardDark : ArrowForward,
            styles: stylesLight,
            goToClass: false,
            ab: "",
            school: false,
            previousRoom: "",
        };
    }

    componentDidMount() {
        this.fetchSchedule(this.props.userId);
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = dayData[today];
        this.setState({ab: todayEntry, school: true})
    }

    fetchSchedule = async (userId) => {
        try {
            if (userId) {
                const scheduleCollectionRef = collection(db, `users/${userId}/schedule`);
                const scheduleSnapshot = await getDocs(scheduleCollectionRef);

                if (!scheduleSnapshot.empty) {
                    const scheduleData = scheduleSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    this.setState({
                        schedule: scheduleData,
                        eighth: scheduleData[0],
                        fifth: scheduleData[1],
                        first: scheduleData[2],
                        fourth: scheduleData[3],
                        lunch: scheduleData[4],
                        second: scheduleData[5],
                        seventh: scheduleData[6],
                        sixth: scheduleData[7],
                        third: scheduleData[8]
                    }, this.setCurrentPeriod);
                } else {
                    console.log('No schedule documents found!');
                }
            } else {
                console.error('User ID is undefined');
            }
        } catch (error) {
            console.error('Error fetching schedule documents: ', error);
            Alert.alert('Error', 'There was an error fetching the schedule documents.');
        }
    };

    getCurrentPeriod() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTime = hours * 60 + minutes;

        const building = this.state.schedule[0]?.building || "Allen High School";

        const periods = {
            "Allen High School": [
                { id: 1, start: 8 * 60 + 45, end: 9 * 60 + 37 },
                { id: 2, start: 9 * 60 + 43, end: 11 * 60 + 16 },
                { id: 3, start: 11 * 60 + 22, end: 13 * 60 + 28 },
                { id: 4, start: 13 * 60 + 35, end: 15 * 60 + 8 },
                { id: 5, start: 9 * 60 + 43, end: 11 * 60 + 16 },
                { id: 6, start: 11 * 60 + 22, end: 13 * 60 + 28 },
                { id: 7, start: 13 * 60 + 35, end: 15 * 60 + 8 },
                { id: 8, start: 15 * 60 + 14, end: 16 * 60 + 5 },
            ],
            "Lowery Freshman Center": [
                { id: 1, start: 8 * 60 + 45, end: 9 * 60 + 37 },
                { id: 2, start: 9 * 60 + 43, end: 10 * 60 + 35 },
                { id: 3, start: 11 * 60 + 28, end: 13 * 60 + 28 },
                { id: 4, start: 13 * 60 + 35, end: 15 * 60 + 8 },
                { id: 5, start: 10 * 60 + 41, end: 11 * 60 + 22 },
                { id: 6, start: 11 * 60 + 22, end: 13 * 60 + 28 },
                { id: 7, start: 13 * 60 + 35, end: 15 * 60 + 8 },
                { id: 8, start: 15 * 60 + 14, end: 16 * 60 + 5 },
            ],
            "STEAM Center": [
                { id: 1, start: 8 * 60 + 14, end: 9 * 60 + 8 },
                { id: 2, start: 9 * 60 + 25, end: 10 * 60 + 58 },
                { id: 3, start: 11 * 60 + 39, end: 13 * 60 + 12 },
                { id: 4, start: 14 * 60 + 0, end: 15 * 60 + 33 },
                { id: 5, start: 9 * 60 + 25, end: 10 * 60 + 58 },
                { id: 6, start: 11 * 60 + 39, end: 13 * 60 + 12 },
                { id: 7, start: 14 * 60 + 0, end: 15 * 60 + 33 },
            ],
        };

        const buildingPeriods = periods[building] || periods["Allen High School"];

        for (let period of buildingPeriods) {
            if (currentTime >= period.start && currentTime <= period.end) {
                return period.id;
            }
        }

        return 1;
    }

    setCurrentPeriod = () => {
        const currentPeriod = this.getCurrentPeriod();
        this.setState({ current: currentPeriod });
    }

    handleClassChange = (newArr) => {
        switch(this.state.current){
            case 1:
                this.setState({first: newArr});
                break;
            case 2:
                this.setState({second: newArr});
                break;
            case 3:
                this.setState({third: newArr});
                break;
            case 4:
                this.setState({fourth: newArr});
                break;
            case 5:
                this.setState({fifth: newArr});
                break;
            case 6:
                this.setState({sixth: newArr});
                break;
            case 7:
                this.setState({seventh: newArr});
                break;
            case 8:
                this.setState({eighth: newArr});
                break;
            case 9:
                this.setState({lunch: newArr});
                break;
            default:
                break;
        }
    }

    renderCarousel = (current) => {
        var scheduleMap;

        if(this.state.ab == "A"){
            scheduleMap = {
                1: this.state.first,
                2: this.state.second,
                3: this.state.third,
                4: this.state.fourth,
                5: this.state.eighth,
                6: this.state.lunch,
            }
        } else {
            scheduleMap = {
                1: this.state.first,
                2: this.state.fifth,
                3: this.state.sixth,
                4: this.state.seventh,
                5: this.state.eighth,
                6: this.state.lunch,
            }
        }

        const scheduleItem = scheduleMap[current];

        return scheduleItem && scheduleItem.id ? (
            <HomeCards key={scheduleItem.id} info={scheduleItem} dark={this.props.dark} />
        ) : (
            <View style={{alignSelf: 'center'}}>
                <Text> Loading </Text>
            </View>
        );
    };

    increase = () => {
        this.setState(prevState => ({
            current: prevState.current < 6 ? prevState.current + 1 : prevState.current
        }));
    }

    decrease = () => {
        this.setState(prevState => ({
            current: prevState.current > 1 ? prevState.current - 1 : prevState.current
        }));
    }

    handleSubmit = () => {
        var scheduleMap;

        if(this.state.ab == "A"){
            scheduleMap = {
                1: this.state.first,
                2: this.state.second,
                3: this.state.third,
                4: this.state.fourth,
                5: this.state.eighth,
                6: this.state.lunch,
            }
        } else {
            scheduleMap = {
                1: this.state.first,
                2: this.state.fifth,
                3: this.state.sixth,
                4: this.state.seventh,
                5: this.state.eighth,
                6: this.state.lunch,
            }
        }

        const roomNumber = scheduleMap[this.state.current].roomNumber;
        // console.log(roomNumber);
        const prevRoom = this.state.previousRoom;
        // console.log(prevRoom);

        this.setState({goToClass: false})

        this.props.navigation.navigate("Map", { targetRoom: roomNumber, prevRoom: prevRoom });
    }

    handleSwipe = ({ nativeEvent }) => {
        if (nativeEvent.state === State.END) {
            if (nativeEvent.translationX < -10) {
                this.increase();
            } else if (nativeEvent.translationX > 10) {
                this.decrease();
            }
        }
    };

    handleGoToClass = () => {
        this.setState({goToClass: true})
        var scheduleMap;

        if(this.state.ab == "A"){
            scheduleMap = {
                1: this.state.first,
                2: this.state.second,
                3: this.state.third,
                4: this.state.fourth,
                5: this.state.eighth,
                6: this.state.lunch,
            }
        } else {
            scheduleMap = {
                1: this.state.first,
                2: this.state.fifth,
                3: this.state.sixth,
                4: this.state.seventh,
                5: this.state.eighth,
                6: this.state.lunch,
            }
        }

        if(this.state.current != 1){
            const prevRoom = scheduleMap[this.state.current-1].roomNumber;
            this.setState({previousRoom: prevRoom});
        }
    }

    render() {
        if (!this.state.school) {
            return (
                <View>
                    <Text style={this.state.styles.noSchool}> Yay, Looks like there is not school today! </Text>
                </View>
            );
        }
    
        return (
            <View>
                <View style={this.state.styles.viewer}>
                    <Pressable 
                        onPress={this.decrease}
                        style={this.state.styles.arrows}
                    >
                        <Image 
                            style={this.state.styles.image}
                            source={this.state.arrowBack}
                        />
                    </Pressable>
    
                    <PanGestureHandler onHandlerStateChange={this.handleSwipe}>
                        <View>
                            {this.renderCarousel(this.state.current)}
                        </View>
                    </PanGestureHandler>
    
                    <Pressable 
                        onPress={this.increase}
                        style={this.state.styles.arrows}
                    >
                        <Image 
                            style={this.state.styles.image}
                            source={this.state.arrowForward}
                        />
                    </Pressable>
                </View>
    
                <Pressable 
                    style={this.state.styles.button}
                    onPress={this.handleGoToClass}
                >
                    <Text style={this.state.styles.buttonText}> Go To Class </Text>
                </Pressable>
    
                {this.state.goToClass ? 
                    <View style={this.state.styles.modalBackground}>
                        <Text style={this.state.styles.classHeading}> Go To Class </Text>
                        <View style={this.state.styles.inputClass}>
                            <Text style={this.state.styles.from}> From: </Text>
                            <TextInput style={this.state.styles.classInput}> {this.state.previousRoom} </TextInput>
                        </View>
                        <Pressable 
                            style={this.state.styles.button}
                            onPress={this.handleSubmit}
                        >
                            <Text style={this.state.styles.buttonText}> Go </Text>
                        </Pressable>
                        <Pressable 
                            style={this.state.styles.buttonCancel}
                            onPress={() => {this.setState({goToClass: false})}}
                        >
                            <Text style={this.state.styles.buttonText}> Cancel </Text>
                        </Pressable>
                    </View> 
                    : 
                    <View>
                    </View>
                }
            </View>
        );
    }
    
}
