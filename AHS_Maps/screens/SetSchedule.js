import React, { useEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';

import { stylesLight } from '../styles/light/SetScheduleLight';
// import { stylesDark } from '../styles/dark/SetScheduleDark';

import WavyHeader from '../components/headers/WavyHeader';
import Carousel from '../components/cards/Carousel';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function SetSchedule({ route, navigation }) {
    const { userId } = route.params;
    const [darkMode, setDarkMode] = useState(false);
    let styles = stylesLight;

    return (
        <View style={styles.fullScreen}>
            {/* <WavyHeader 
                customHeight={15}
                customTop={8}
                customImageDimensions={20}
                darkMode={darkMode}
            /> */}
            <View style={styles.container}>
            <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                <Text style={styles.title} >Schedule Set Up</Text>
                <Carousel dark={darkMode} userId={userId} navigation={navigation}  />
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}
