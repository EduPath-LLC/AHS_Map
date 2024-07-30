import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Pressable, Alert, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import WavyHeader from '../components/headers/WavyHeader';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { stylesDark } from '../styles/dark/SettingsDark';
import { stylesLight } from '../styles/light/SettingsLight';
import { auth } from '../firebase';
import Loader from '../components/Loader';

import AccountIcon from '../assets/images/Account_Icon.png';
import NotificationIcon from '../assets/images/Notification_Icon.png';
import AppearanceIcon from '../assets/images/Appearance_Icon.png';
import HelpAndSupportIcon from '../assets/images/Help_And_Support_Icon.png';
import AboutIcon from '../assets/images/About_Icon.png';
import ArrowForward from '../assets/images/ArrowForward.png';

export default function Settings({ userId, navigation }) {
    const [darkMode, setDarkMode] = useState(false);
    const [minuteAlert, setMinuteAlert] = useState(false);
    const oMAtoggleSwitch = () => setMinuteAlert(previousState => !previousState);
    const [loading, setLoading] = useState(false);
    let styles = darkMode ? stylesDark : stylesLight;

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

    const changeMode = async () => {
        try {
            setLoading(true);
            const docRef = doc(db, 'users', userId);
            const userDocSnap = await getDoc(docRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                await updateDoc(docRef, { dark: !userData.dark });
                setDarkMode(!userData.dark);
            }
            setLoading(false)
        } catch (e) {
            Alert.alert("Error", e);
            setLoading(false)
        }
    };

    if (loading) {
        return(
            <View style={styles.fullScreen}>
            <WavyHeader 
                customHeight={15}
                customTop={10}
                customImageDimensions={20}
                darkMode={darkMode}
            />
            <View style={{marginTop: 250}}>
            <Loader />
            </View>
            </View>
        )
    }

    

    return (
        <View style={styles.fullScreen}>
            <WavyHeader 
                customHeight={15}
                customTop={10}
                customImageDimensions={20}
                darkMode={darkMode}
            />
            
            <View style={styles.container}>
                <Text style={styles.bigText}> Settings </Text>
                    
                    <Pressable style={styles.buttonNew} onPress={() => navigation.navigate("Account", {userId: userId})}>
                        <Image
                            source={AccountIcon}
                            style={styles.imageStyle}
                        />
                            <Text style={styles.buttonNewText}>Account</Text>
                        <Image
                            source={ArrowForward}
                            style={styles.imageArrowStyle}
                        />
                    </Pressable>

                    <Pressable style={styles.buttonNew} onPress={() => navigation.navigate("Notifications", {userId: userId})}>
                        <Image
                            source={NotificationIcon}
                            style={styles.imageStyle}
                        />
                            <Text style={styles.buttonNewText}>Notifications</Text>
                        <Image
                            source={ArrowForward}
                            style={styles.imageArrowStyle}
                        />
                    </Pressable>

                    <Pressable style={styles.buttonNew} onPress={() => navigation.navigate("Appearance", {userId: userId})}>
                        <Image
                            source={AppearanceIcon}
                            style={styles.imageStyle}
                        />
                            <Text style={styles.buttonNewText}>Appearance</Text>
                        <Image
                            source={ArrowForward}
                            style={styles.imageArrowStyle}
                        />
                    </Pressable>

                    <Pressable style={styles.buttonNew} onPress={() => navigation.navigate("SetSchedule", {userId: userId})}>
                        <Image
                            source={HelpAndSupportIcon}
                            style={styles.imageStyle}
                        />
                            <Text style={styles.buttonNewText}>Help and Support</Text>
                        <Image
                            source={ArrowForward}
                            style={styles.imageArrowStyle}
                        />
                    </Pressable>

                    <Pressable style={styles.buttonNew} onPress={() => navigation.navigate("SetSchedule", {userId: userId})}>
                        <Image
                            source={AboutIcon}
                            style={styles.imageStyle}
                        />
                            <Text style={styles.buttonNewText}>About</Text>
                        <Image
                            source={ArrowForward}
                            style={styles.imageArrowStyle}
                        />
                    </Pressable>

                <View style={{flexDirection: 'row', marginTop: 50}}>
                    <Text style={styles.normalText}> Dark Mode </Text>
                    <Switch
                        style={styles.toggleSwitch}
                        trackColor={{false: '#767577', true: '#007AFF'}}
                        thumbColor={darkMode ? '#f4f3f4' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={changeMode}
                        value={darkMode}
                    />
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.normalText}> 1 Min Alert  </Text>
                    <Switch
                        style={styles.toggleSwitch}
                        trackColor={{false: '#767577', true: '#007AFF'}}
                        thumbColor={minuteAlert ? '#f4f3f4' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={oMAtoggleSwitch}
                        value={minuteAlert}
                    />
                </View>
            </View>
        </View>
    );
}
