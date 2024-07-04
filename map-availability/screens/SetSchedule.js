import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';

import { styles } from '../styles/light/SetSchedule';

import WavyHeader from '../components/headers/WavyHeader';
import Carousel from '../components/cards/Carousel';

export default function SetSchedule({ route, navigation }) {
    const { userId } = route.params;

    return (
        <View style={styles.fullScreen}>
            <WavyHeader 
                customHeight={15}
                customTop={8}
                customImageDimensions={20}
            />
            <View style={styles.container}>
            <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'position' : 'height'}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? -100 : 0}
                >
                <Text style={styles.title} >Schedule Set Up</Text>
                <Carousel userId={userId} navigation={navigation} />
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}
