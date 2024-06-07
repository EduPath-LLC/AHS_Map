import React, { useState } from 'react';
import { View, Pressable, Text, Alert } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';

import { auth, app, db } from '../../firebase'

import WavyHeader from '../../components/headers/WavyHeader';
import EmailInput from '../../components/inputs/Email';

import { styles } from '../../styles/light/ResetPasswordLight';


export default function ResetPassword({navigation}) {
  const [email, setEmail] = useState('');

  const handleReset = async (email) => {
    if( email == ''){
        Alert.alert('Error', 'Please Enter a Password')
        return;
    }

    const checkEmailStudent = email.slice(-21);
    const checkEmailTeacher = email.slice(-13);

    if(checkEmailStudent !== "@student.allenisd.org" && checkEmailTeacher !== "@allenisd.org"){
      Alert.alert("Warning", "You must use an Allen ISD email")
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent successfully.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
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

      <Text style={styles.title}> Reset Password </Text>

        <EmailInput email={email} onEmailChange={setEmail} />

        <Pressable
          style={styles.button}
          onPress={() => handleReset(email)}
        >
          <Text style={styles.buttonText}> Send Reset Email </Text>
        </Pressable>

        <Pressable
          onPress={() => {navigation.navigate('SignIn')}}
        >
          <Text style={styles.return}> Return To Login Page</Text>
        </Pressable>
        
      </View>
    </View>
  );
}
