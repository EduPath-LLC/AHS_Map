import React, { useState } from 'react';
import { View, Pressable, Text, Alert } from 'react-native';
import { signInWithEmailAndPassword, resendVerificationEmail } from 'firebase/auth';

import { auth, app, db } from '../../firebase'

import BigHeader from '../../components/headers/BigHeader';
import EmailInput from '../../components/inputs/Email';
import PasswordInput from '../../components/inputs/Password';

import { styles } from '../../styles/light/SignInLight';


export default function SignIn({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      

      navigation.navigate("BottomTab");
      
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

      <BigHeader />

      <View style={styles.container}>

        <EmailInput email={email} onEmailChange={setEmail} />
        <PasswordInput password={password} onPasswordChange={setPassword} />

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
          <Text style={styles.signUp}> Sign Up</Text>
        </Pressable>
        
      </View>
    </View>
  );
}
