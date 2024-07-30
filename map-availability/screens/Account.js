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


export default function Account() {
  return (
    <View>
        <Pressable style={[styles.button, {backgroundColor: "#F66060"}]} onPress={logOut}>
            <Text style={styles.buttonText}>Log Out</Text>
        </Pressable>
    </View>
  )
}
