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
  SafeAreaView
} from 'react-native';
import { styles } from '../../styles/light/SignUpLight';
import WavyHeader from '../../components/headers/WavyHeader';
import EmailInput from '../../components/inputs/Email';
import PasswordInput from '../../components/inputs/Password';
import Loader from '../../components/Loader';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { useFonts } from 'expo-font';

import { auth, app, db } from '../../firebase'

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [ppAccept, setPPAccept] = useState(false);

  const validateInputs = (email, password, confirm) => {
    if (email === '' || password === '' || confirm === '') {
      Alert.alert("Warning", "Please fill in all required fields");
      return false;
    }
    if (password !== confirm) {
      Alert.alert("Warning", "Passwords Don't Match");
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
    if (validateInputs(email, password, confirm)) {
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
      
      await setDoc(docRef, {
        dark: false,
        email: email,
        firstName: FirstName,
        firstTime: true,
      });

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
      
      {/* Improved Modal with better styling */}
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
              <Text style={styles.scrollText}>Privacy Policy for Edupath</Text>
              <Text style={styles.scrollText2}>Effective Date: 7/31/2024</Text>
              <Text style={styles.scrollText}>1. Introduction</Text>
              <Text style={styles.scrollText2}>
                Eagle Maps is committed to protecting the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application designed for school students below 18 years old. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application. Use the app at your own risk.
              </Text>
              <Text style={styles.scrollText}>2. Data Collection</Text>
              <Text style={styles.scrollText2}>We collect the following information:</Text>
              <Text style={styles.scrollText3}>→ First Name: To personalize your experience within the app.</Text>
              <Text style={styles.scrollText3}>→ Email Address: For authentication purposes.</Text>
              <Text style={styles.scrollText3}>→ Student Schedule: To provide you with your class schedule within the app.</Text>
              <Text style={styles.scrollText3}>→ Location Data: We temporarily access your location data for a small amount of time to provide certain functionalities, but we do not store this data. To reiterate, the location data is handled locally on your phone and never leaves the device. Therefore, we, nor anyone else, have access to it.</Text>
              <Text style={styles.scrollText}>3. Data Usage</Text>
              <Text style={styles.scrollText2}>We use the collected data to:</Text>
              <Text style={styles.scrollText3}>→ Authenticate and manage user accounts.</Text>
              <Text style={styles.scrollText3}>→ Display the student's schedule.</Text>
              <Text style={styles.scrollText3}>→ Send time-based notifications relevant to the user's schedule.</Text>
              <Text style={styles.scrollText3}>→ Temporarily access location data to enhance app functionality without storing it.</Text>
              <Text style={styles.scrollText}>4. Data Sharing</Text>
              <Text style={styles.scrollText2}>We do not share your personal data with third parties, except:</Text>
              <Text style={styles.scrollText3}>→ Firebase: For authentication and data storage. Firebase's use of your data is governed by their privacy policy.</Text>
              <Text style={styles.scrollText3}>→ Google Maps API: For location-based services on Android devices. Google's use of your data is governed by their privacy policy.</Text>
              <Text style={styles.scrollText}>5. Data Security</Text>
              <Text style={styles.scrollText2}>We take data security seriously and use Firebase's security features to protect your information. However, please note that no method of transmission over the internet or electronic storage is 100% secure.</Text>
              <Text style={styles.scrollText}>6. User Rights</Text>
              <Text style={styles.scrollText2}>As our app is designed for users below 18 years old, we ensure compliance with child privacy laws. Parents or guardians can:</Text>
              <Text style={styles.scrollText3}>→ Request access to their child's data.</Text>
              <Text style={styles.scrollText3}>→ Request deletion of their child's data.</Text>
              <Text style={styles.scrollText3}>→ Withdraw consent to data collection and usage.</Text>
              <Text style={styles.scrollText}>7. Parental Consent</Text>
              <Text style={styles.scrollText2}>We require parental consent for students under 18 to use our app. By allowing your child to use Eagle Maps, you consent to the collection and use of their data as described in this Privacy Policy.</Text>
              <Text style={styles.scrollText}>8. Notifications</Text>
              <Text style={styles.scrollText2}>We send time-based notifications to users to remind them of their schedules and important events. These notifications are part of the app's functionality.</Text>
              <Text style={styles.scrollText}>9. Updates to This Policy</Text>
              <Text style={styles.scrollText2}>We may update this Privacy Policy from time to time. We will notify you of any changes by updating the effective date at the top of this policy.</Text>
              <Text style={styles.scrollText}>10. Contact Us</Text>
              <Text style={styles.scrollText2}>If you have any questions or concerns about this Privacy Policy or our data practices, please contact team@edupathllc.com</Text>
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