import React, { Component } from 'react'
import { View, Text, Alert, Image, Pressable, KeyboardAvoidingView, Platform, PanResponder } from 'react-native'
import { doc, getDocs, collection, setDoc, docRef, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase'

import { stylesLight } from '../../styles/light/CarouselLight'

import Loader from '../Loader';
import CardInputs from './CardInputs';

import ArrowBack from '../../assets/images/ArrowBack.png';
// import ArrowBackDark from '../../assets/images/ArrowBackDark.png';
import ArrowForward from '../../assets/images/ArrowForward.png';
// import ArrowForwardDark from '../../assets/images/ArrowForwardDark.png';

export default class Carousel extends Component {
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
            arrowBack: null,
            arrowForward: null,
        };

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dx > 50) {
                    this.decrease();
                } else if (gestureState.dx < -50) {
                    this.increase();
                }
            }
        });
    }

    componentDidMount() {
        this.fetchSchedule(this.props.userId);
        this.setState({arrowBack: ArrowBack, arrowForward: ArrowForward});
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
                this.setState({first: newArr})
            case 2:
                this.setState({second: newArr})
            case 3:
                this.setState({third: newArr})
            case 4:
                this.setState({fourth: newArr})
            case 5:
                this.setState({fifth: newArr})
            case 6:
                this.setState({sixth: newArr})
            case 7:
                this.setState({seventh: newArr})
            case 8:
                this.setState({eighth: newArr})
            case 9:
                this.setState({lunch: newArr})
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
            <CardInputs key={scheduleItem.id} info={scheduleItem} onInputChange={this.handleClassChange} dark={this.props.dark} />
        ) : (
            <View style={{alignSelf: 'center'}}>
                <Loader />
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

    handleSubmit = async () => {

        const isEmpty = this.checkIfEmpty()

        // if(isEmpty) {
        //     return;
        // }


        try {
            this.setState({loading: true})
            const data = [this.state.first, this.state.second, this.state.third, this.state.fourth, this.state.fifth, this.state.sixth, this.state.seventh, this.state.eighth, this.state.lunch]

            data.map(async (data) => {
                let docRef = doc(db, `users/${this.props.userId}/schedule`, data.id);
                await setDoc(docRef, data, { merge: true });
            })

            let docRef = doc(db, `users`, this.props.userId);
            await updateDoc(docRef, {firstTime: false});

            this.props.navigation.navigate("BottomTab", { userId: this.props.userId })
            this.setState({loading: false})
            
        } catch(e) {
            this.setState({loading: false})
            Alert.alert('Error', e.message)
        }
    }

    checkIfEmpty = () => {

        this.setState({loading: true})
        var empty = false;


        for (let key in this.state.first) {
            let value = this.state.first[key];
            if (value === "") {
                empty = true;
                break;
            }
        }
    

        if(!empty) {
            for (let key in this.state.second) {
                let value = this.state.second[key];
                if (value === "") {
                    empty = true;
                    break;
                }
            }
        }

        if(!empty) {
            for (let key in this.state.third) {
                let value = this.state.third[key];
                if (value === "") {
                    empty = true;
                    break;
                }
            }
        }
        

        if(!empty) {
            for (let key in this.state.fourth) {
                let value = this.state.fourth[key];
                if (value === "") {
                    empty = true;
                    break;
                }
            }
        }
        

        if(!empty) {
            for (let key in this.state.fifth) {
                let value = this.state.fifth[key];
                if (value === "") {
                    empty = true;
                    break;
                }
            }
        }

        if(!empty) {
            for (let key in this.state.sixth) {
                let value = this.state.sixth[key];
                if (value === "") {
                    empty = true;
                    break;
                }
            }
        }

        if(!empty) {
            for (let key in this.state.seventh) {
                let value = this.state.seventh[key];
                if (value === "") {
                    empty = true;
                    break;
                }
            }
        }

        if(!empty) {
            for (let key in this.state.eighth) {
                let value = this.state.eighth[key];
                if (value === "") {
                    empty = true;
                    break;
                }
            }
        }

        if(!empty) {
            for (let key in this.state.lunch) {
                let value = this.state.lunch[key];
                if (value === "") {
                    empty = true;
                    break;
                }
            }
        }

        this.setState({loading: false})

        if(empty){
            Alert.alert('Warning', 'One or More Fields are Empty')
            return true
        }

        return false
    }
    

    render() {
        return (
            <View style={stylesLight.container} {...this.panResponder.panHandlers}>
                {this.state.loading? 
                ( <Loader /> ) :
                (
                    <View>
                        <View style={stylesLight.viewer}>
                            <Pressable 
                                onPress={this.decrease}
                                style={stylesLight.arrows}
                            >
                                <Image 
                                    style={stylesLight.image}
                                    source={this.state.arrowBack}
                                />
                            </Pressable>

                            {this.renderCarousel(this.state.current)}

                            <Pressable 
                                onPress={this.increase}
                                style={stylesLight.arrows}
                            >
                                <Image 
                                    style={stylesLight.image}
                                    source={this.state.arrowForward}
                                />
                            </Pressable>
                        </View>

                        <Pressable 
                            style={stylesLight.button}
                            onPress={this.handleSubmit}
                        >
                            <Text style={stylesLight.buttonText}> Finish </Text>
                        </Pressable>
                    </View>
            )}
            </View>
        );
    }
}