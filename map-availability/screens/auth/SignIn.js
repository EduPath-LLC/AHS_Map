import React, { useState, useEffect, useCallback } from 'react';
import { View, Pressable, Text, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  // Load saved email on component mount
  useEffect(() => {
    const loadSavedEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('userEmail');
        if (savedEmail) {
          setEmail(savedEmail);
        }
      } catch (error) {
        console.error('Error loading saved email:', error);
      }
    };

    loadSavedEmail();
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

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

    const checkEmailStudent = email.slice(-21);
    const checkEmailTeacher = email.slice(-13);

    if (checkEmailStudent !== "@student.allenisd.org" && checkEmailTeacher !== "@allenisd.org") {
      Alert.alert("Warning", "You must use an Allen ISD email");
      return;
    }

    try {
      setLoading(true);

      // Sign in user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save email after successful login
      try {
        await AsyncStorage.setItem('userEmail', email);
      } catch (error) {
        console.error('Error saving email:', error);
      }

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

      setPassword("");
      setLoading(false);

      if (firstTime) {
        navigation.navigate("SetSchedule", { userId: user.uid });
      } else {
        navigation.navigate("BottomTab", { userId: user.uid });
      }

    } catch (error) {
      if (error.message === "Firebase: Error (auth/invalid-credential).") {
        Alert.alert("Error", "Invalid Credentials");
      } else {
        Alert.alert('Error', error.message);
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