import React, { useState } from 'react';
import { View, Text, TextInput, Switch, Pressable, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import WavyHeader from '../components/headers/WavyHeader';
import { styles } from '../styles/dark/SettingsDark';
import { auth } from '../firebase';

export default function Settings({ userId, navigation }) {
    const [dMisEnabled, dMsetIsEnabled] = useState(false);
    const dMtoggleSwitch = () => dMsetIsEnabled(previousState => !previousState);
    const [oMAisEnabled, oMAsetIsEnabled] = useState(false);
    const oMAtoggleSwitch = () => oMAsetIsEnabled(previousState => !previousState);

    const logOut = async () => {
        signOut(auth)
        .then(() => {
            navigation.navigate("SignIn")
        }).catch((e) => {
            Alert.alert("Error", e);
        })
    }
    
    return (
        <View style={styles.fullScreen}>
            <WavyHeader 
                customHeight={15}
                customTop={10}
                customImageDimensions={20}
            />
            <View style={styles.container}>
                <Text style={styles.bigText}> Settings </Text>
                <TextInput style={styles.firstNameTextInput} placeholder='First Name' />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.normalText}> Dark Mode </Text>
                    <Switch
                        style={styles.toggleSwitch}
                        trackColor={{false: '#767577', true: '#296fd6'}}
                        thumbColor={dMisEnabled ? '#f4f3f4' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={dMtoggleSwitch}
                        value={dMisEnabled}
                    />
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.normalText}> 1 Min Alert  </Text>
                    <Switch
                        style={styles.toggleSwitch}
                        trackColor={{false: '#767577', true: '#296fd6'}}
                        thumbColor={oMAisEnabled ? '#f4f3f4' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={oMAtoggleSwitch}
                        value={oMAisEnabled}
                    />
                </View>
                <View>
                    <Pressable style={styles.button}>
                        <Text style={styles.buttonText} onPress={() => navigation.navigate("SetSchedule", {userId: userId})}>Edit Schedule</Text>
                    </Pressable>
                </View>
                <View>
                    <Pressable style={[styles.button, {backgroundColor: "#EE6F6F"}]} onPress={logOut}>
                        <Text style={styles.buttonText}>Log Out</Text>
                    </Pressable>
                </View>
            </View> 
        </View>
    );
}
