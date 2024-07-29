import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Switch, Pressable, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import WavyHeader from '../components/headers/WavyHeader';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { stylesDark } from '../styles/dark/SettingsDark';
import { stylesLight } from '../styles/light/SettingsLight';
import { auth } from '../firebase';
import Loader from '../components/Loader';

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
                <View>
                    <Pressable style={styles.button} onPress={() => navigation.navigate("SetSchedule", {userId: userId})}>
                        <Text style={styles.buttonText}>Edit Schedule</Text>
                    </Pressable>
                </View>
                <View>
                    <Pressable style={[styles.button, {backgroundColor: "#F66060"}]} onPress={logOut}>
                        <Text style={styles.buttonText}>Log Out</Text>
                    </Pressable>
                </View>
            </View> 
        </View>
    );
}
