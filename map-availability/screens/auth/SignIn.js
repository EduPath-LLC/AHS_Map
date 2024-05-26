import React, { useState } from 'react';
import { View, Pressable, Text, Alert } from 'react-native';
import { signInWithEmailAndPassword, resendVerificationEmail } from 'firebase/auth';

import { auth, app, db } from '../../firebase'

import EmailInput from '../../components/inputs/Email';
import PasswordInput from '../../components/inputs/Password';

import { styles } from '../../styles/light/SignUpLight';


export default function SignIn({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (email, password) => {
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
      // Handle sign-in errors
      Alert.alert('Error', error.message);
    }
    };


  return (
    <View style={styles.fullScreen}>
      <View style={styles.container}>
        <EmailInput email={email} onEmailChange={setEmail} />
        <PasswordInput password={password} onPasswordChange={setPassword} />

        <Pressable
          style={styles.button}
          onPress={() => handleSignIn(email, password)}>
          <Text style={styles.buttonText}> Log In </Text>
        </Pressable>
      </View>
    </View>
  );
}
