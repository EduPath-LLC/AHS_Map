import React, { useState } from 'react';
import { View, Text, Switch, Pressable, Alert, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import WavyHeader from '../components/headers/WavyHeader';
import { auth } from '../firebase';
import { stylesDark } from '../styles/dark/SettingsDark';
import { stylesLight } from '../styles/light/NotificationsLight';
import ArrowBack from '../assets/images/ArrowBack.png';

export default function Account({ userId, navigation }) {
  const [darkMode, setDarkMode] = useState(false);
  const styles = darkMode ? stylesDark : stylesLight;
  const [minuteAlert, setMinuteAlert] = useState(false);
  const [dayAlert, setDayAlert] = useState(false);

  const oMAtoggleSwitch = () => setMinuteAlert(previousState => !previousState);
  const dayToggleSwitch = () => setDayAlert(previousState => !previousState);

  const logOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate("SignIn");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={styles.fullScreen}>
      <WavyHeader
        customHeight={15}
        customTop={10}
        customImageDimensions={20}
        darkMode={darkMode}
      />
      <View style={styles.container}>
        <Pressable style={styles.buttonNew} onPress={() => navigation.navigate("Settings", { userId })}>
          <Image
            source={ArrowBack}
            style={styles.imageArrowStyle}
          />
          <Text style={styles.buttonNewText}>Back</Text>
        </Pressable>
        <View style={styles.switchContainer}>
          <Text style={styles.normalText}>1 Min Alert</Text>
          <Switch
            style={styles.toggleSwitch}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={minuteAlert ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={oMAtoggleSwitch}
            value={minuteAlert}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.normalText}>A/B DAY Alert</Text>
          <Switch
            style={styles.toggleSwitch}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={dayAlert ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={dayToggleSwitch}
            value={dayAlert}
          />
        </View>
      </View>
    </View>
  );
}
