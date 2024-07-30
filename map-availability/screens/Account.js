import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Pressable, Alert, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import WavyHeader from '../components/headers/WavyHeader';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { stylesDark } from '../styles/dark/AccountDark';
import { stylesLight } from '../styles/light/AccountLight';
import { auth } from '../firebase';
import Loader from '../components/Loader';
import { useRoute } from '@react-navigation/native';

import AccountIcon from '../assets/images/Account_Icon.png';
import NotificationIcon from '../assets/images/Notification_Icon.png';
import AppearanceIcon from '../assets/images/Appearance_Icon.png';
import HelpAndSupportIcon from '../assets/images/Help_And_Support_Icon.png';
import AboutIcon from '../assets/images/About_Icon.png';
import ArrowForward from '../assets/images/ArrowForward.png';
import ArrowBack from '../assets/images/ArrowBack.png'


export default function Account({navigation}) {
  const [darkMode, setDarkMode] = useState(false);
  let styles = darkMode ? stylesDark : stylesLight;
  const route = useRoute();
  const userId = route.params.userId;

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
    signOut(auth)
        .then(() => {
            navigation.navigate("SignIn");
        }).catch((e) => {
            Alert.alert("Error", e);
        });
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
      
      <Pressable style={styles.buttonNew} onPress={() => navigation.navigate("Settings", {userId: userId})}>
          <Image
            source={ArrowBack}
            style={styles.imageArrowStyle}
          />
          <Text style={styles.buttonNewText}>Back</Text>
        </Pressable>
        <Text style={styles.bigText}> Account </Text>
        <Pressable style={styles.button} onPress={() => navigation.navigate("SetSchedule", {userId: userId})}>
          <Text style={styles.buttonText}>Edit Schedule</Text>
        </Pressable>
        <Pressable style={[styles.button, {backgroundColor: "#F66060"}]} onPress={logOut}>
          <Text style={styles.buttonText}>Log Out</Text>
        </Pressable>
    </View>
    </View>
  )
}
