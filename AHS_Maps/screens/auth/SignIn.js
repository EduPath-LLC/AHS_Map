import React, { useState, useEffect, useCallback } from 'react';
import { View, Pressable, Text, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import * as FileSystem from 'expo-file-system';

import { auth, db } from '../../firebase';

import WavyHeader from '../../components/headers/WavyHeader';
import EmailInput from '../../components/inputs/Email';
import PasswordInput from '../../components/inputs/Password';
import Loader from '../../components/Loader';

import { styles } from '../../styles/light/SignInLight';

SplashScreen.preventAutoHideAsync();

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Kanit-Black': require('../../assets/fonts/Kanit-Black.ttf'),
      'Kanit-Bold': require('../../assets/fonts/Kanit-Bold.ttf'),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    async function checkUserFile() {
      try {
        const fileUri = FileSystem.documentDirectory + 'userInfo.txt';
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
  
        if (fileInfo.exists) {
          // Read the file
          const content = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
          const lines = content.split('\n');
          
          if (lines.length > 1) {
            const savedEmail = lines[0];
            setEmail(savedEmail);
  
            navigation.replace('Back');
          }
        }
      } catch (error) {
        console.error('Error reading user info file:', error);
      }
    }
  
    async function prepare() {
      try {
        await loadFonts();
        await checkUserFile();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);
  
  const saveUserInfo = async (email) => {
    const path = FileSystem.documentDirectory + 'userInfo.txt';
    const FirstName = email.slice(0,1).toUpperCase() + email.slice(1, email.indexOf("."))
    const content = `${email}\n${FirstName}`;
  
    try {
      await FileSystem.writeAsStringAsync(path, content, { encoding: FileSystem.EncodingType.UTF8 });
      console.log('File saved successfully');
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const isFirstTime = async (userId) => {
    try {
      if (userId) {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const firstTime = userData.firstTime;

          return !!firstTime;
        } else {
          console.log('No such document!');
        }
      } else {
        console.error('User ID is undefined');
      }
    } catch (error) {
      console.error('Error fetching document: ', error);
    }
    return false;
  };

  const handleSignIn = async (email, password) => {
    if (email === '' || password === '') {
      Alert.alert("Warning", "One or More Fields is empty");
      return;
    }

    const studentEmailRegex = /^[a-zA-Z0-9._%+-]+@student\.allenisd\.org$/;
    const teacherEmailRegex = /^[a-zA-Z0-9._%+-]+@allenisd\.org$/;

    if (!studentEmailRegex.test(email) && !teacherEmailRegex.test(email)) {
      Alert.alert("Warning", "You must use an Allen ISD email");
      return;
    }

    try {
      setLoading(true);

      // Sign in user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user's email is verified
      if (!user.emailVerified) {
        Alert.alert(
          'Email Verification',
          'Your email is not verified. Please verify your email before logging in.',
          [{ text: 'OK', onPress: () => sendEmailVerification(user) }]
        );
        setLoading(false);
        return;
      }

      const firstTime = await isFirstTime(user.uid);

      setTimeout(() => saveUserInfo(email), 0);

      setEmail("");
      setPassword("");
      setLoading(false);

      if (firstTime) {
        navigation.navigate("SetSchedule", { userId: user.uid });
      } else {
        navigation.navigate("BottomTab", { userId: user.uid });
      }

    } catch (error) {
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
      
      setLoading(false);
    }
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.fullScreen} onLayout={onLayoutRootView}>
      <WavyHeader customHeight={20} customTop={15} customImageDimensions={25} />
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <Text style={styles.title}>Sign In</Text>
          {loading ? (
            <View style={{ marginTop: 100 }}>
              <Loader />
            </View>
          ) : (
            <View>
              <EmailInput email={email} onEmailChange={setEmail} />
              <PasswordInput password={password} onPasswordChange={setPassword} />
              <View style={styles.forgotPasswordContainer}>
                <Text
                  style={styles.forgotPassword}
                  onPress={() => navigation.navigate('ResetPassword')}
                >
                  Forgot Password?
                </Text>
              </View>
              <Pressable
                style={styles.button}
                onPress={() => handleSignIn(email, password)}
              >
                <Text style={styles.buttonText}>Log In</Text>
              </Pressable>
              <Pressable
                style={styles.signUpButton}
                onPress={() => navigation.navigate('SignUp')}
              >
                <Text style={styles.signUpText}>Don't Have an Account Yet? </Text>
                <Text style={styles.signUp}>Sign Up</Text>
              </Pressable>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}