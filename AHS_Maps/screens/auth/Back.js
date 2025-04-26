import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../../firebase';
import Loader from '../../components/Loader';
import WavyHeader from '../../components/headers/WavyHeader'
import PasswordInput from '../../components/inputs/Password';

import { styles } from '../../styles/light/BackLight'

export default function Back({ navigation }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const fileUri = FileSystem.documentDirectory + 'userInfo.txt';
        const fileContents = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
        const [savedEmail, savedName] = fileContents.split('\n');
        
        setEmail(savedEmail);
        setName(savedName);

      } catch (error) {
        console.error('Error reading user info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  const handleSignIn = async () => {
    if (password === '') {
      Alert.alert("Warning", "Password field is empty");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setPassword('');
      setLoading(false);
      navigation.navigate("BottomTab", { userId: user.uid });
    } catch (error) {
      setLoading(false);

      switch (error.code) {
        case 'auth/invalid-credential':
          Alert.alert("Error", "Incorrect password. Please try again.");
          break;
        case 'auth/user-not-found':
          Alert.alert("Error", "No user found with this email.");
          break;
        case 'auth/wrong-password':
          Alert.alert("Error", "Incorrect password. Please try again.");
          break;
        case 'auth/invalid-email':
          Alert.alert("Error", "The email address is badly formatted.");
          break;
        default:
          Alert.alert('Error', error.message);
          break;
      }
    }
  };

  async function wipeUserInfo() {
    try {
        const fileUri = FileSystem.documentDirectory + 'userInfo.txt';
        await FileSystem.writeAsStringAsync(fileUri, '', { encoding: FileSystem.EncodingType.UTF8 });
        navigation.navigate("SignIn")
    } catch (error) {
        console.error('Error wiping userInfo.txt:', error);
    }
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.fullScreen}>
        <WavyHeader customHeight={15} customTop={10} customImageDimensions={20} />

        <View style={styles.container}>
            <Text style={styles.bigText}>Hello, {name}</Text>

            <PasswordInput password={password} onPasswordChange={setPassword} style={styles.input} />

            <Pressable onPress={handleSignIn} style={styles.button}>
                <Text style={styles.buttonText}>Log In</Text>
            </Pressable>

            <Text style={styles.return} onPress={wipeUserInfo}> Not You? Return to Sign In </Text>
        </View>
    </View>
);

}
