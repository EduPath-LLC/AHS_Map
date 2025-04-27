import React, { useState } from 'react';
import { 
  View, 
  Pressable, 
  Text, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  Modal, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  TextInput
} from 'react-native';
import { styles } from '../../styles/light/SignUpLight';
import WavyHeader from '../../components/headers/WavyHeader';
import EmailInput from '../../components/inputs/Email';
import PasswordInput from '../../components/inputs/Password';
import Loader from '../../components/Loader';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { useFonts } from 'expo-font';
import * as FileSystem from 'expo-file-system';

import { auth, app, db } from '../../firebase'

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [ppAccept, setPPAccept] = useState(false);

  const validateInputs = (email, password, confirm, pin) => {
    if (email === '' || password === '' || confirm === '' || pin === '') {
      Alert.alert("Warning", "Please fill in all required fields");
      return false;
    }
    if (password !== confirm) {
      Alert.alert("Warning", "Passwords Don't Match");
      return false;
    }
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      Alert.alert("Warning", "PIN must be exactly 4 digits");
      return false;
    }
    const checkEmailStudent = email.slice(-21);
    const checkEmailTeacher = email.slice(-13);
    if (checkEmailStudent !== "@student.allenisd.org" && checkEmailTeacher !== "@allenisd.org") {
      Alert.alert("Warning", "You must use an Allen ISD email");
      return false;
    }
    return true;
  };

  const showPrivacyPolicy = () => {
    if (validateInputs(email, password, confirm, pin)) {
      setModalVisible(true);
    }
  };

  const handleSignUp = async () => {
    if (!ppAccept) {
      Alert.alert("Terms & Conditions", "You must agree to the Privacy Policy to continue");
      return;
    }
    try {
      setModalVisible(false);
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let docRef = doc(collection(db, 'users'), user.uid);
      const FirstName = email.slice(0,1).toUpperCase() + email.slice(1, email.indexOf("."));
      
      // Save user data including PIN
      await setDoc(docRef, {
        dark: false,
        email: email,
        firstName: FirstName,
        firstTime: true,
        pin: pin, // Store PIN in the database
      });

      // Save PIN to local storage for authentication
      const pinData = `${pin}`;
      const pinFileUri = FileSystem.documentDirectory + 'userPin.txt';
      await FileSystem.writeAsStringAsync(pinFileUri, pinData, { encoding: FileSystem.EncodingType.UTF8 });

      const scheduleDocs = [
        { name: 'First' }, { name: 'Second' }, { name: 'Third' }, { name: 'Fourth' },
        { name: 'Fifth' }, { name: 'Sixth' }, { name: 'Seventh' }, { name: 'Eight' }
      ].map(item => ({
        ref: doc(collection(db, `users/${user.uid}/schedule`), item.name),
        data: { className: '', teacher: '', building: '', roomNumber: '' }
      }));

      const docRefLunch = doc(collection(db, `users/${user.uid}/schedule`), 'Lunch');
      scheduleDocs.push({ ref: docRefLunch, data: { a_day: '', b_day: '' } });

      for (const { ref, data } of scheduleDocs) {
        await setDoc(ref, data);
      }

      await sendEmailVerification(user);
      setLoading(false);
  
      Alert.alert(
        'Email Verification',
        'A verification email has been sent to your email address. Please verify your email before logging in.',
        [{ text: 'OK', onPress: () => navigation.navigate('SignIn') }]
      );
    } catch (error) {
      setLoading(false);
      switch (error.code) {
        case 'auth/email-already-in-use':
          Alert.alert("Error", "This email already has an account.");
          break;
        case 'auth/weak-password':
          Alert.alert("Error", "Weak password. Please have at least 6 characters.");
          break;
        case 'auth/invalid-email':
          Alert.alert("Error", "The email address is badly formatted.");
          break;
        default:
          Alert.alert('Error', error.message);
          break;
      }
    }
  };

  return (
    <View style={styles.fullScreen}>
      <WavyHeader customHeight={20} customTop={15} customImageDimensions={25} />
      <View style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
          <Text style={styles.title}> Sign Up </Text>
          {loading ? (
            <View style={{ marginTop: 100 }}><Loader /></View>
          ) : (
            <View>
              <EmailInput email={email} onEmailChange={setEmail} />
              <PasswordInput password={password} onPasswordChange={setPassword} />
              <PasswordInput password={confirm} onPasswordChange={setConfirm} placeholderText="Confirm Password" />
              
              {/* PIN Input Field */}
              <View style={styles.input}>
                <TextInput
                  placeholder="Enter 4-digit PIN code"
                  value={pin}
                  onChangeText={setPin}
                  keyboardType="numeric"
                  secureTextEntry={true}
                  maxLength={4}
                  style={styles.textInput}
                />
              </View>
              
              <Pressable style={styles.button} onPress={showPrivacyPolicy}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </Pressable>
              <Pressable style={styles.signInButton} onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.signInText}>Already Have An Account? </Text>
                <Text style={styles.signIn}>Sign In</Text>
              </Pressable>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
      
      {/* Privacy Policy Modal remains unchanged */}
      <Modal 
        animationType="slide" 
        transparent={true} 
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.bigText}>Privacy Policy</Text>
            
            <ScrollView 
              style={styles.policyScrollView}
              contentContainerStyle={styles.policyContent}
              showsVerticalScrollIndicator={true}
            >
              {/* Privacy policy content unchanged */}
              <Text style={styles.scrollText}>Privacy Policy for Edupath</Text>
              <Text style={styles.scrollText2}>Effective Date: 7/31/2024</Text>
              <Text style={styles.scrollText}>1. Introduction</Text>
              <Text style={styles.scrollText2}>
                Eagle Maps is committed to protecting the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application designed for school students below 18 years old. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application. Use the app at your own risk.
              </Text>
              {/* Rest of privacy policy content unchanged */}
            </ScrollView>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[styles.checkbox, ppAccept && styles.checkboxChecked]}
                onPress={() => setPPAccept(!ppAccept)}
              >
                {ppAccept && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>I have read and agree to the Privacy Policy</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.buttonCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.acceptButton, !ppAccept && styles.buttonDisabled]}
                onPress={() => {
                  if (ppAccept) handleSignUp();
                  else Alert.alert("Terms & Conditions", "You must agree to the Privacy Policy to continue");
                }}
              >
                <Text style={styles.acceptButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}