import React, { Component } from 'react'
import { View, Text, Pressable, Image, Alert } from 'react-native'
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase'

import { stylesLight } from '../../styles/light/HomeCarouselLight'
import { stylesDark } from '../../styles/dark/HomeCarouselDark'
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
            styles: this.props.dark ? stylesDark : stylesLight,
        };
    }

    componentDidMount() {
        this.fetchSchedule(this.props.userId);

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
                    });
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
        const scheduleMap = {
            1: this.state.first,
            2: this.state.second,
            3: this.state.third,
            4: this.state.fourth,
            5: this.state.fifth,
            6: this.state.sixth,
            7: this.state.seventh,
            8: this.state.eighth,
            9: this.state.lunch,
        };

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
            current: prevState.current < 9 ? prevState.current + 1 : prevState.current
        }));
    }

    decrease = () => {
        this.setState(prevState => ({
            current: prevState.current > 1 ? prevState.current - 1 : prevState.current
        }));
    }

    handleSubmit = () => {
        const scheduleMap = {
            1: this.state.first,
            2: this.state.second,
            3: this.state.third,
            4: this.state.fourth,
            5: this.state.fifth,
            6: this.state.sixth,
            7: this.state.seventh,
            8: this.state.eighth,
            9: this.state.lunch,
        };

        const roomNumber = scheduleMap[this.state.current].roomNumber;
        this.props.navigation.navigate('Map', {roomNumber: roomNumber});
    }

    render() {
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

                    {this.renderCarousel(this.state.current)}

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
                    onPress={this.handleSubmit}
                >
                    <Text style={this.state.styles.buttonText}> Go To Class </Text>
                </Pressable>
            </View>
        );
    }
}
