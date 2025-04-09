import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Pressable, Alert, Image } from 'react-native';
import { signOut } from 'firebase/auth';
import WavyHeader from '../components/headers/WavyHeader';
import { auth } from '../firebase';
// import { stylesDark } from '../styles/dark/AppearanceDark';
import { stylesLight } from '../styles/light/AppearanceLight';
import ArrowBack from '../assets/images/ArrowBack.png';
import Loader from '../components/Loader';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Appearance({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);
  const styles = stylesLight;
  const [minuteAlert, setMinuteAlert] = useState(false);
  const [dayAlert, setDayAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const userId = route.params.userId;

  const oMAtoggleSwitch = () => setMinuteAlert(previousState => !previousState);
  const dayToggleSwitch = () => setDayAlert(previousState => !previousState);


  const changeMode = async () => {
      try {
          setLoading(true);
          const docRef = doc(db, 'users', userId);
          const userDocSnap = await getDoc(docRef);

          if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              await updateDoc(docRef, { dark: !userData.dark });
              setDarkMode(!userData.dark);
          }
          setLoading(false)
      } catch (e) {
          Alert.alert("Error", e);
          setLoading(false)
      }
  };

if (loading) {
    return(
        <View style={styles.fullScreen}>
        <WavyHeader 
            customHeight={15}
            customTop={10}
            customImageDimensions={20}
            darkMode={darkMode}
        />
        <View style={{marginTop: 250}}>
        <Loader />
        </View>
        </View>
    )
}

  return (
    <View style={styles.fullScreen}>
      <WavyHeader
        customHeight={15}
        customTop={10}
        customImageDimensions={20}
        darkMode={darkMode}
      />
      <View style={styles.container}>
        <Pressable style={styles.buttonNew} onPress={() => navigation.navigate("Settings", { userId })}>
          <Image
            source={ArrowBack}
            style={styles.imageArrowStyle}
          />
          <Text style={styles.buttonNewText}>Back</Text>
        </Pressable>
        <Text style={styles.bigText}> Appearance </Text>
      </View>
    </View>
  );
}
