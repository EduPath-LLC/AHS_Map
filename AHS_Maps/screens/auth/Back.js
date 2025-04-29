import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../../firebase';
import Loader from '../../components/Loader';
import WavyHeader from '../../components/headers/WavyHeader'
import PasswordInput from '../../components/inputs/Password';

import { styles } from '../../styles/light/BackLight'

// Keys for secure storage
const EMAIL_KEY = 'user_email';
const NAME_KEY = 'user_name';
const PASSWORD_KEY = 'user_password';

export default function Back({ navigation }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [usePassword, setUsePassword] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        // Read from your existing FileSystem first to migrate data
        try {
          const FileSystem = require('expo-file-system');
          const fileUri = FileSystem.documentDirectory + 'userInfo.txt';
          const fileExists = await FileSystem.getInfoAsync(fileUri);
          
          if (fileExists.exists) {
            const fileContents = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
            const [savedEmail, savedName] = fileContents.split('\n');
            
            if (savedEmail && savedName) {
              // Store in SecureStore for future use
              await SecureStore.setItemAsync(EMAIL_KEY, savedEmail);
              await SecureStore.setItemAsync(NAME_KEY, savedName);
              
              setEmail(savedEmail);
              setName(savedName);
            }
          }
        } catch (fsError) {
          console.log('No file system data to migrate:', fsError);
        }

        // Now try to load from SecureStore
        const savedEmail = await SecureStore.getItemAsync(EMAIL_KEY);
        const savedName = await SecureStore.getItemAsync(NAME_KEY);
        
        if (savedEmail && savedName) {
          setEmail(savedEmail);
          setName(savedName);
          
          // Check biometric availability
          const compatible = await LocalAuthentication.hasHardwareAsync();
          const enrolled = await LocalAuthentication.isEnrolledAsync();
          setBiometricsAvailable(compatible && enrolled);
          
          // Check if we have a stored password for biometric auth
          const hasStoredPassword = await SecureStore.getItemAsync(PASSWORD_KEY) !== null;
          
          // If biometrics are available and password exists, attempt authentication immediately
          if (compatible && enrolled && hasStoredPassword) {
            authenticateWithBiometrics();
          } else {
            // Otherwise use password
            setUsePassword(true);
          }
        } else {
          // If no saved credentials, redirect to sign in
          // But only on initial load to prevent loops
          if (isInitialLoad) {
            navigation.replace("SignIn");
          }
        }
      } catch (error) {
        console.error('Error loading user info:', error);
        setUsePassword(true); // Fallback to password if there's an error
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    loadUserInfo();
  }, [isInitialLoad, navigation]);

  const authenticateWithBiometrics = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your account',
        cancelLabel: 'Use Password instead',
        fallbackLabel: 'Use Password',
        disableDeviceFallback: false,
      });

      if (result.success) {
        // Biometric authentication successful
        handleSignInAfterBiometricAuth();
      } else {
        // Biometric authentication failed or was canceled
        setUsePassword(true);
      }
    } catch (error) {
      console.error('Biometric auth error:', error);
      setUsePassword(true); // Fall back to password
    }
  };

  const handleSignInAfterBiometricAuth = async () => {
    try {
      setLoading(true);
      
      // Retrieve the stored password from secure storage
      const storedPassword = await SecureStore.getItemAsync(PASSWORD_KEY);
      
      if (storedPassword) {
        // Use retrieved credentials with Firebase authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, storedPassword);
        const user = userCredential.user;
        
        navigation.navigate("BottomTab", { userId: user.uid });
      } else {
        // If somehow we don't have a stored password, fall back to manual password entry
        setUsePassword(true);
        Alert.alert("Info", "Please enter your password to continue");
      }
      
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

      // After successful login, store the password securely for future biometric auth
      await SecureStore.setItemAsync(EMAIL_KEY, email);
      await SecureStore.setItemAsync(NAME_KEY, name);
      await SecureStore.setItemAsync(PASSWORD_KEY, password);

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
      // Clear secure storage
      await SecureStore.deleteItemAsync(EMAIL_KEY);
      await SecureStore.deleteItemAsync(NAME_KEY);
      await SecureStore.deleteItemAsync(PASSWORD_KEY);
      
      // Also clear any legacy filesystem storage
      try {
        const FileSystem = require('expo-file-system');
        const fileUri = FileSystem.documentDirectory + 'userInfo.txt';
        await FileSystem.writeAsStringAsync(fileUri, '', { encoding: FileSystem.EncodingType.UTF8 });
      } catch (fsError) {
        console.log('Error clearing file storage:', fsError);
      }
      
      navigation.replace("SignIn");
    } catch (error) {
      console.error('Error wiping user info:', error);
    }
  }

  async function switchAuth() {
    if (usePassword && biometricsAvailable) {
      // Switch from password to biometrics
      authenticateWithBiometrics();
    } else {
      // Switch to password or show message if already using password
      setUsePassword(true);
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

        {usePassword ? (
          // Password input when necessary
          <PasswordInput password={password} onPasswordChange={setPassword} style={styles.input} />
        ) : null}

        {usePassword ? (
          // Password login button
          <Pressable onPress={handleSignIn} style={styles.button}>
            <Text style={styles.buttonText}>Log In</Text>
          </Pressable>
        ) : null}

        {/* Button to switch between auth methods */}
        {biometricsAvailable && (
          <Pressable onPress={switchAuth} style={styles.switchAuthButton}>
            <Text style={styles.switchAuthText}>
              {usePassword ? "Use Biometrics Instead" : "Use Password Instead"}
            </Text>
          </Pressable>
        )}

        <Text style={styles.return} onPress={wipeUserInfo}>Not You? Return to Sign In</Text>
      </View>
    </View>
  );
}