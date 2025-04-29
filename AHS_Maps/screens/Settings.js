import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Pressable, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { stylesLight } from '../styles/light/SettingsLight';
import { auth } from '../firebase';
import Loader from '../components/Loader';
import WavyHeader from '../components/headers/WavyHeader';

// Import Expo Vector Icons
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export default function Settings({ userId, navigation }) {
    const [darkMode, setDarkMode] = useState(false);
    const [minuteAlert, setMinuteAlert] = useState(false);
    const oMAtoggleSwitch = () => setMinuteAlert(previousState => !previousState);
    const [loading, setLoading] = useState(false);
    let styles = stylesLight;

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
            Alert.alert("Error", e.message);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.fullScreen}>
                <WavyHeader 
                    customHeight={15}
                    customTop={10}
                    customImageDimensions={20}
                    darkMode={darkMode}
                />
                <View style={{ marginTop: 250 }}>
                    <Loader />
                </View>
            </View>
        );
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
                <Text style={styles.bigText}>Settings</Text>

                <Pressable style={styles.buttonNew} onPress={() => navigation.navigate("Account", { userId: userId })}>
                    <Feather name="user" size={30} color="black" />
                    <Text style={styles.buttonNewText}>Account</Text>
                    <Feather name="chevron-right" size={24} color="gray" />
                </Pressable>

                <Pressable style={styles.buttonNew} onPress={() => navigation.navigate("HelpAndSupport", { userId: userId })}>
                    <Ionicons name="help-circle-outline" size={30} color="black" />
                    <Text style={styles.buttonNewText}>Help and Support</Text>
                    <Feather name="chevron-right" size={24} color="gray" />
                </Pressable>

                <Pressable style={styles.buttonNew} onPress={() => navigation.navigate("PrivacyPolicy", { userId: userId })}>
                    <MaterialIcons name="privacy-tip" size={30} color="black" />
                    <Text style={styles.buttonNewText}>Privacy Policy</Text>
                    <Feather name="chevron-right" size={24} color="gray" />
                </Pressable>

                {/* <Pressable style={styles.buttonNew} onPress={() => navigation.navigate("About", { userId: userId })}>
                    <Ionicons name="information-circle-outline" size={30} color="black" />
                    <Text style={styles.buttonNewText}>About</Text>
                    <Feather name="chevron-right" size={24} color="gray" />
                </Pressable> */}

            </View>
        </View>
    );
}
