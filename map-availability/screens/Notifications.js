import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Pressable, Alert, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import WavyHeader from '../components/headers/WavyHeader';
import { auth } from '../firebase';
import { stylesDark } from '../styles/dark/NotificationsDark';
import { stylesLight } from '../styles/light/NotificationsLight';
import ArrowBack from '../assets/images/ArrowBack.png';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Notifications({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);
  const styles = darkMode ? stylesDark : stylesLight;
  const [minuteAlert, setMinuteAlert] = useState(false);
  const [dayAlert, setDayAlert] = useState(false);
  const route = useRoute();
  const userId = route.params.userId;

  const oMAtoggleSwitch = () => setMinuteAlert(previousState => !previousState);
  const dayToggleSwitch = () => setDayAlert(previousState => !previousState);

  useEffect(() => {
    const isDarkMode = async () => {
      try {
        if (userId) {
          const userDocRef = doc(db, 'users', userId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();

            if(userData.dark) {
              setDarkMode(true)
            } else {
              setDarkMode(false)
            }

          } else {
            console.log('No such document!');
          }
        } else {
          console.error('User ID is undefined');
        }
      } catch (error) {
        console.error('Error fetching document: ', error);
      }
    };

    isDarkMode();
  }, [userId]);

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
        <Text style={styles.bigText}> Notifications </Text>
        <View style={styles.switchContainer}>
          <Text style={styles.normalText}>1 Minute Alert</Text>
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
