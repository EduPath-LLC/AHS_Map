import React, { useState } from 'react';
import { View, Pressable, Text, Alert, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

import { auth, app, db } from '../../firebase'

import EmailInput from '../../components/inputs/Email';
import PasswordInput from '../../components/inputs/Password';

import { styles } from '../../styles/light/SignUpLight';


export default function SignUp({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSignUp = async (email, password) => {

    if(email == '' || password == '' || confrim == '') {
      Alert.alert("Warning", "One or More Fields is empty")
      return;
    }

    if(password != confirm){
      Alert.alert("Warning", "Passwords Don't Match")
      return;
    }

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
      <ScrollView contentContainerStyle={styles.container}>
        <EmailInput email={email} onEmailChange={setEmail} />
        <PasswordInput password={password} onPasswordChange={setPassword} />
        <PasswordInput password={confirm} onPasswordChange={setConfirm} />
        <Pressable style={styles.button} onPress={() => handleSignUp(email, password)}>
          <Text style={styles.buttonText}> Sign Up </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
