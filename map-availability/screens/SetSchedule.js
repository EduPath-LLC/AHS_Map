import React from 'react';
import { View, Text } from 'react-native';

import { styles } from '../styles/light/SetSchedule';

import WavyHeader from '../components/headers/WavyHeader';
import Carousel from '../components/cards/Carousel';

export default function SetSchedule({ route, navigation }) {
    const { userId } = route.params;

    return (
        <View style={styles.fullScreen}>
            <WavyHeader 
                customHeight={15}
                customTop={10}
                customImageDimensions={20}
            />
            <View style={styles.container}>
                <Text style={styles.title} >Schedule Set Up</Text>
                <Carousel userId={userId} navigation={navigation} />
            </View>
        </View>
    );
}
