import React, { useState } from 'react';
import { View, Pressable, Text, Alert } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';

import { auth, app, db } from '../../firebase'

import BigHeader from '../../components/headers/BigHeader';
import EmailInput from '../../components/inputs/Email';
import PasswordInput from '../../components/inputs/Password';

import { styles } from '../../styles/light/SignUpLight';


export default function SignUp({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSignUp = async (email, password, confirm) => {

    if(email == '' || password == '' || confirm == '') {
      Alert.alert("Warning", "One or More Fields is empty")
      return;
    }

    if(password != confirm){
      Alert.alert("Warning", "Passwords Don't Match")
      return;
    }

    const checkEmailStudent = email.slice(-21);
    const checkEmailTeacher = email.slice(-13);

    if(checkEmailStudent !== "@student.allenisd.org" && checkEmailTeacher !== "@allenisd.org"){
      Alert.alert("Warning", "You must use an Allen ISD email")
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let docRef = doc(collection(db, 'users'), user.uid);
      
      await setDoc(docRef, {
        email: email,
        FirstName: (email.slice(0, email.indexOf("."))).toUpperCase(),
        firstTime: true,
    });

      let sched = await addDoc(collection(db, `users/${user.uid}/schedule`), {
        f: 1
      });
  
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

      <BigHeader />

      <View style={styles.container}>

        <EmailInput email={email} onEmailChange={setEmail} />
        <PasswordInput password={password} onPasswordChange={setPassword} />
        <PasswordInput password={confirm} onPasswordChange={setConfirm} />

        <Pressable style={styles.button} onPress={() => handleSignUp(email, password, confirm)}>
          <Text style={styles.buttonText}> Sign Up </Text>
        </Pressable>

        <Pressable
          style={styles.signInButton}
          onPress={() => {navigation.navigate('SignIn')}}
        >

          <Text style={styles.signInText}> Already Have An Account?</Text>
          <Text style={styles.signIn}> Sign In </Text>
        </Pressable>
        
      </View>
    </View>
  );
}
