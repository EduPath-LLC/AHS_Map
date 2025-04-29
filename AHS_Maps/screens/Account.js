import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Pressable, Alert } from 'react-native';
import { signOut, deleteUser } from 'firebase/auth';
import WavyHeader from '../components/headers/WavyHeader';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { stylesLight } from '../styles/light/AccountLight';
import { auth } from '../firebase';
import Loader from '../components/Loader';
import { useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

export default function Account({navigation}) {
  const [darkMode, setDarkMode] = useState(false);
  let styles = stylesLight;
  const route = useRoute();
  const userId = route.params.userId;

  async function wipeUserInfo() {
    try {
      const fileUri = FileSystem.documentDirectory + 'userInfo.txt';
      await FileSystem.writeAsStringAsync(fileUri, '', { encoding: FileSystem.EncodingType.UTF8 });
      navigation.navigate("SignIn");
    } catch (error) {
      console.error('Error wiping userInfo.txt:', error);
    }
  }

  const logOut = async () => {
    signOut(auth)
      .then(() => {
        wipeUserInfo();
        navigation.navigate("SignIn");
      }).catch((e) => {
        Alert.alert("Error", e);
      });
  };

  const showDeleteConfirmation = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => handleDeleteUser(), style: "destructive" }
      ],
      { cancelable: true }
    );
  };

  const handleDeleteUser = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const scheduleColRef = collection(db, 'users', user.uid, 'schedule');
        const scheduleSnapshot = await getDocs(scheduleColRef);
        const deletePromises = scheduleSnapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
        await Promise.all(deletePromises);

        const userDocRef = doc(db, 'users', user.uid);
        await deleteDoc(userDocRef);

        await deleteUser(user);

        wipeUserInfo();
        navigation.navigate("SignIn");
      } catch (e) {
        if (e.code === "auth/requires-recent-login") {
          Alert.alert("Session Expired", "Please log out and log back in before deleting your account.");
        } else {
          Alert.alert("Error", e.message);
        }
      }
    } else {
      Alert.alert("Error", "No user is currently signed in.");
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

        <Text style={styles.bigText}>Account</Text>

        <Pressable style={styles.button} onPress={() => navigation.navigate("SetSchedule", {userId: userId})}>
          <Text style={styles.buttonText}>Edit Schedule</Text>
        </Pressable>

        <Pressable style={[styles.button, { backgroundColor: "#F66060" }]} onPress={logOut}>
          <Text style={styles.buttonText}>Log Out</Text>
        </Pressable>

        <Pressable style={[styles.button, { backgroundColor: "#ad0603" }]} onPress={showDeleteConfirmation}>
          <Text style={styles.buttonText}>Delete User</Text>
        </Pressable>

      </View>
    </View>
  );
}
