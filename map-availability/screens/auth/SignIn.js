import React, { useState } from 'react';
import { View, Pressable, Text, Alert } from 'react-native';
import { signInWithEmailAndPassword, resendVerificationEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useFonts } from 'expo-font';

import { auth, app, db } from '../../firebase'

import WavyHeader from '../../components/headers/WavyHeader';
import EmailInput from '../../components/inputs/Email';
import PasswordInput from '../../components/inputs/Password';

import { styles } from '../../styles/light/SignInLight';


export default function SignIn({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fontsLoaded] = useFonts({
    'Kanit-Black': require('../../assets/fonts/Kanit-Black.ttf'),
    'Kanit-Bold': require('../../assets/fonts/Kanit-Bold.ttf'),
  });

  const isFirstTime = async (userId) => {
    try {
      if (userId) {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const firstTime = userData.firstTime;

          if(firstTime) {
            return true
          } else {
            return false
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


  const handleSignIn = async (email, password) => {

    if(email == '' || password == '') {
      Alert.alert("Warning", "One or More Fields is empty")
      return;
    }

    const checkEmailStudent = email.slice(-21);
    const checkEmailTeacher = email.slice(-13);

    if(checkEmailStudent !== "@student.allenisd.org" && checkEmailTeacher !== "@allenisd.org"){
      Alert.alert("Warning", "You must use an Allen ISD email")
      return;
    }
    

    try {
      // Sign in user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if the user's email is verified
      if (!user.emailVerified) {
        Alert.alert(
          'Email Verification',
          'Your email is not verified. Please verify your email before logging in.',
          [{ text: 'OK', onPress: () => resendVerificationEmail(email) }]
        );
        return;
      }
      
      if(isFirstTime(user.uid)){
        navigation.navigate("SetSchedule", { userId: user.uid });
      } else {
        navigation.navigate("BottomTab", { userId: user.uid });
      }
      
    } catch (error) {
      if(error.message === "Firebase: Error (auth/invalid-credential)."){
        Alert.alert("Error", "Invalid Credentials");
        return
      }
      Alert.alert('Error', error.message);
    }
    };


  return (
    <View style={styles.fullScreen}>

      <WavyHeader 
        customHeight={20}
        customTop={15}
        customImageDimensions={25}
      />

      <View style={styles.container}>

        <Text style={styles.title}> Sign In </Text>

        <EmailInput email={email} onEmailChange={setEmail} />
        <PasswordInput password={password} onPasswordChange={setPassword} />

        <View style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPassword} onPress={() => navigation.navigate('ResetPassword')} > Forgot Password? </Text>
        </View>

        <Pressable
          style={styles.button}
          onPress={() => handleSignIn(email, password)}
        >
          <Text style={styles.buttonText}> Log In </Text>
        </Pressable>

        <Pressable
          style={styles.signUpButton}
          onPress={() => {navigation.navigate('SignUp')}}
        >
          <Text style={styles.signUpText}> Don't Have an Account Yet?</Text>
          <Text style={styles.signUp}> Sign Up </Text>
        </Pressable>
        
      </View>
    </View>
  );
}
