import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  Pressable,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import WavyHeader from '../components/headers/WavyHeader';
import { auth } from '../firebase';
import { stylesLight } from '../styles/light/HelpAndSupportLight';
import { doc, getDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function HelpAndSupport({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);
  const styles = stylesLight;
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('General');
  const route = useRoute();
  const userId = route.params.userId;

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        if (userId) {
          const userDocRef = doc(db, 'users', userId);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setEmail(userData.email);
          } else {
            console.log('No such document!');
          }
        } else {
          console.error('User ID is undefined');
        }
      } catch (error) {
        console.error('Error fetching document: ', error);
      }
    };
    fetchEmail();
  }, [userId]);

  const submitIssue = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message before submitting.");
      return;
    }
    try {
      const user = auth.currentUser;
      await addDoc(collection(db, 'issues'), {
        userId,
        email: email,
        message: message.trim(),
        category: category,
        createdAt: Timestamp.now(),
      });
      Alert.alert("Success", "Your message has been submitted.");
      setMessage('');
    } catch (error) {
      Alert.alert("Error", "Failed to submit your message.");
      console.error("Firestore Error:", error);
    }
  };

  const categories = ["General", "Account", "Technical", "Feature Request"];

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.fullScreen}
    >
      <WavyHeader
        customHeight={15}
        customTop={10}
        customImageDimensions={20}
        darkMode={darkMode}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} color="black" />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          
          <Text style={styles.bigText}>Help And Support</Text>
          
          <View style={styles.supportCard}>
            <Text style={styles.cardTitle}>Send us a message</Text>
            
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.activeCategoryButton
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text 
                    style={[
                      styles.categoryText, 
                      category === cat && styles.activeCategoryText
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.inputLabel}>Your message</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Describe your issue or suggestion..."
              multiline
              numberOfLines={6}
              style={styles.messageInput}
              placeholderTextColor="#A0A0A0"
            />
            
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={submitIssue}
              activeOpacity={0.8}
            >
              <Ionicons name="send" size={20} color="white" style={styles.submitIcon} />
              <Text style={styles.submitText}>Submit Message</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.contactInfoCard}>
            <Text style={styles.contactTitle}>Need immediate assistance?</Text>
            <Text style={styles.contactText}>
              Contact our support team directly at team@edupathllc.com
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}