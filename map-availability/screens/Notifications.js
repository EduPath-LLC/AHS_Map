import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Pressable, Alert, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import WavyHeader from '../components/headers/WavyHeader';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { stylesDark } from '../styles/dark/SettingsDark';
import { stylesLight } from '../styles/light/AccountLight';
import { auth } from '../firebase';
import Loader from '../components/Loader';

import AccountIcon from '../assets/images/Account_Icon.png';
import NotificationIcon from '../assets/images/Notification_Icon.png';
import AppearanceIcon from '../assets/images/Appearance_Icon.png';
import HelpAndSupportIcon from '../assets/images/Help_And_Support_Icon.png';
import AboutIcon from '../assets/images/About_Icon.png';
import ArrowForward from '../assets/images/ArrowForward.png';
import ArrowBack from '../assets/images/ArrowBack.png'


export default function Account({userId, navigation}) {
  const [darkMode, setDarkMode] = useState(false);
  let styles = darkMode ? stylesDark : stylesLight;

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
        <Pressable style={[styles.button, {backgroundColor: "#F66060"}]} onPress={logOut}>
            <Text style={styles.buttonText}>Log Out</Text>
        </Pressable>
    </View>
    </View>
  )
}