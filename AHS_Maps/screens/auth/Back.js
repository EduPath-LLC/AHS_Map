import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as LocalAuthentication from 'expo-local-authentication';
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
  const [pin, setPin] = useState('');
  const [userPin, setUserPin] = useState('');
  const [loading, setLoading] = useState(true);
  const [usePin, setUsePin] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        // Load user email and name
        const fileUri = FileSystem.documentDirectory + 'userInfo.txt';
        const fileContents = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
        const [savedEmail, savedName] = fileContents.split('\n');
        
        setEmail(savedEmail);
        setName(savedName);

        // Load user PIN
        const pinFileUri = FileSystem.documentDirectory + 'userPin.txt';
        const savedPin = await FileSystem.readAsStringAsync(pinFileUri, { encoding: FileSystem.EncodingType.UTF8 });
        setUserPin(savedPin);

        // Check biometric availability
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setBiometricsAvailable(compatible && enrolled);

        // If biometrics are available, attempt authentication immediately
        if (compatible && enrolled) {
          authenticateWithBiometrics();
        } else {
          // If biometrics aren't available, use PIN instead
          setUsePin(true);
        }
      } catch (error) {
        console.error('Error loading user info:', error);
        setUsePin(true); // Fallback to PIN if there's an error
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  const authenticateWithBiometrics = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your account',
        cancelLabel: 'Use PIN instead',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: false,
      });

      if (result.success) {
        // Biometric authentication successful
        handleSignInAfterAuth();
      } else {
        // Biometric authentication failed or was canceled
        setUsePin(true);
      }
    } catch (error) {
      console.error('Biometric auth error:', error);
      setUsePin(true); // Fall back to PIN
    }
  };

  const handlePinAuth = () => {
    if (pin === userPin) {
      handleSignInAfterAuth();
    } else {
      Alert.alert("Error", "Incorrect PIN. Please try again.");
      setPin('');
    }
  };

  const handleSignInAfterAuth = async () => {
    try {
      setLoading(true);
      
      // Only perform Firebase authentication if we need the password
      if (password !== '') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        navigation.navigate("BottomTab", { userId: user.uid });
      } else {
        // Use local auth instead
        navigation.navigate("BottomTab", { userId: auth.currentUser?.uid });
      }

      setPassword('');
      setPin('');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleAuthError(error);
    }
  };

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
      handleAuthError(error);
    }
  };

  const handleAuthError = (error) => {
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
  };

  async function wipeUserInfo() {
    try {
      const fileUri = FileSystem.documentDirectory + 'userInfo.txt';
      await FileSystem.writeAsStringAsync(fileUri, '', { encoding: FileSystem.EncodingType.UTF8 });
      
      // Also clear the PIN
      const pinFileUri = FileSystem.documentDirectory + 'userPin.txt';
      await FileSystem.writeAsStringAsync(pinFileUri, '', { encoding: FileSystem.EncodingType.UTF8 });
      
      navigation.navigate("SignIn");
    } catch (error) {
      console.error('Error wiping user info:', error);
    }
  }

  async function switchAuth() {
    if (usePin && biometricsAvailable) {
      // Switch from PIN to biometrics
      authenticateWithBiometrics();
    } else {
      // Switch to PIN or show message if already using PIN
      setUsePin(true);
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

        {usePin ? (
          // PIN authentication UI
          <View style={styles.input}>
            <TextInput
              placeholder="Enter your 4-digit PIN"
              value={pin}
              onChangeText={setPin}
              keyboardType="numeric"
              secureTextEntry={true}
              maxLength={4}
              style={styles.textInput}
            />
          </View>
        ) : (
          // Password input is rendered when not using PIN
          <PasswordInput password={password} onPasswordChange={setPassword} style={styles.input} />
        )}

        {usePin ? (
          // PIN login button
          <Pressable onPress={handlePinAuth} style={styles.button}>
            <Text style={styles.buttonText}>Verify PIN</Text>
          </Pressable>
        ) : (
          // Regular login button
          <Pressable onPress={handleSignIn} style={styles.button}>
            <Text style={styles.buttonText}>Log In</Text>
          </Pressable>
        )}

        {/* Button to switch between auth methods */}
        {biometricsAvailable && (
          <Pressable onPress={switchAuth} style={styles.switchAuthButton}>
            <Text style={styles.switchAuthText}>
              {usePin ? "Use Biometrics Instead" : "Use PIN Instead"}
            </Text>
          </Pressable>
        )}

        <Text style={styles.return} onPress={wipeUserInfo}>Not You? Return to Sign In</Text>
      </View>
    </View>
  );
}