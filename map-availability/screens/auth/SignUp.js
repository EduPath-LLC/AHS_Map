import React, { useState } from 'react';
import { View, Pressable, Text, Alert } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

import { auth, app, db } from '../../firebase'

import EmailInput from '../../components/inputs/Email';
import PasswordInput from '../../components/inputs/Password';

import { styles } from '../../styles/light/SignUpLight';


export default function SignUp({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (email, password) => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Send email verification
      await sendEmailVerification(user);
  
      // Inform user to check their email for verification
      Alert.alert(
        'Email Verification',
        'A verification email has been sent to your email address. Please verify your email before logging in.',
        [{ text: 'OK', onPress: () => navigation.navigate('SignIn') }]
      );
    } catch (error) {
      // Handle sign-up errors
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
          onPress={() => handleSignUp(email, password)}>
          <Text style={styles.buttonText}> Sign Up </Text>
        </Pressable>
      </View>
    </View>
  );
}
