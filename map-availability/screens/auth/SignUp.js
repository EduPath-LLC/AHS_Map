import React, { useState } from 'react';
import { View, Pressable, Text, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { useFonts } from 'expo-font';

import { auth, app, db } from '../../firebase'

import WavyHeader from '../../components/headers/WavyHeader';
import EmailInput from '../../components/inputs/Email';
import PasswordInput from '../../components/inputs/Password';
import Loader from '../../components/Loader';

import { styles } from '../../styles/light/SignUpLight';


export default function SignUp({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);



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
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let docRef = doc(collection(db, 'users'), user.uid);

      const FirstName = email.slice(0,1).toUpperCase() + email.slice(1, email.indexOf("."))
      
      await setDoc(docRef, {
        dark: false,
        email: email,
        firstName: FirstName,
        firstTime: true,
      });

      let docRefFirst = doc(collection(db, `users/${user.uid}/schedule`), 'First');
      let docRefSecond = doc(collection(db, `users/${user.uid}/schedule`), 'Second');
      let docRefThird = doc(collection(db, `users/${user.uid}/schedule`), 'Third');
      let docRefFourth = doc(collection(db, `users/${user.uid}/schedule`), 'Fourth');
      let docRefFifth = doc(collection(db, `users/${user.uid}/schedule`), 'Fifth');
      let docRefSixth = doc(collection(db, `users/${user.uid}/schedule`), 'Sixth');
      let docRefSeventh = doc(collection(db, `users/${user.uid}/schedule`), 'Seventh');
      let docRefEight = doc(collection(db, `users/${user.uid}/schedule`), 'Eight');
      let docRefLunch = doc(collection(db, `users/${user.uid}/schedule`), 'Lunch');



      await setDoc(docRefFirst, {
        className: '',
        teacher: '',
        building: '',
        roomNumber: ''
     });

      await setDoc(docRefSecond, {
        className: '',
        teacher: '',
        building: '',
        roomNumber: ''
    });

      await setDoc(docRefThird, {
        className: '',
        teacher: '',
        building: '',
        roomNumber: ''
    });

      await setDoc(docRefFourth, {
        className: '',
        teacher: '',
        building: '',
        roomNumber: ''
    });

      await setDoc(docRefFifth, {
        className: '',
        teacher: '',
        building: '',
        roomNumber: ''
    });

      await setDoc(docRefSixth, {
        className: '',
        teacher: '',
        building: '',
        roomNumber: ''
    });

      await setDoc(docRefSeventh, {
        className: '',
        teacher: '',
        building: '',
        roomNumber: ''
    });

      await setDoc(docRefEight, {
        className: '',
        teacher: '',
        building: '',
        roomNumber: ''
    });

      await setDoc(docRefLunch, {
        a_day: '',
        b_day: ''
    });

  
      // Send email verification
      await sendEmailVerification(user);
      setLoading(false)
  
      // Inform user to check their email for verification
      Alert.alert(
        'Email Verification',
        'A verification email has been sent to your email address. Please verify your email before logging in.',
        [{ text: 'OK', onPress: () => navigation.navigate('SignIn') }]
      );
    } catch (error) {
      setLoading(false)
      // Handle sign-up errors
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
      <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >

      <Text style={styles.title}> Sign Up </Text>

      {loading ? (
          <View style={{ marginTop: 100 }}>
            <Loader />
          </View>
        ) : (
          <View>  
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
        )}
        
      </KeyboardAvoidingView>
      </View>
    </View>
  );
}