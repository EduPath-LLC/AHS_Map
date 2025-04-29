import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Pressable, Alert, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import WavyHeader from '../components/headers/WavyHeader';
import { auth } from '../firebase';
// import { stylesDark } from '../styles/dark/AboutDark';
import { stylesLight } from '../styles/light/PrivacyPolicyLight';
import ArrowBack from '../assets/images/ArrowBack.png';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function About({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);
  const styles = stylesLight;
  const [minuteAlert, setMinuteAlert] = useState(false);
  const [dayAlert, setDayAlert] = useState(false);
  const route = useRoute();
  const userId = route.params.userId;

  const oMAtoggleSwitch = () => setMinuteAlert(previousState => !previousState);
  const dayToggleSwitch = () => setDayAlert(previousState => !previousState);

  const logOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate("SignIn");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={styles.fullScreen}>
      <WavyHeader
        customHeight={15}
        customTop={10}
        customImageDimensions={20}
        darkMode={darkMode}
      />
      <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="black" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        <Text style={styles.bigText}> Privacy Policy </Text>
        <ScrollView style={styles.scrollStyle}>
            <Text style={styles.scrollText}>Privacy Policy for Edupath</Text>
            <Text style={styles.scrollText2}>Effective Date: 7/31/2024</Text>
            <Text style={styles.scrollText}>1. Introduction</Text>
            <Text style={styles.scrollText2}>Eagle Maps is committed to protecting the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application designed for school students below 18 years old. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application. Use the app at your own risk.</Text>
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
            <Text style={styles.scrollText3}>→ Google Maps API: For location-based services on Android devices. Google’s use of your data is governed by their privacy policy.</Text>
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
            <Text style={styles.scrollText2}>We may update this Privacy Policy from time to time. We will notify you of any changes by updating the effective date at the top of this Privacy Policy. Continued use of the app after such changes will constitute your consent to the updated policy.</Text>
            <Text style={styles.scrollText}>10. Contact Us</Text>
            <Text style={styles.scrollText2}>If you have any questions or concerns about this Privacy Policy or our data practices, please contact team@edupathllc.com</Text>
        </ScrollView>
      </View>
    </View>
  );
}
