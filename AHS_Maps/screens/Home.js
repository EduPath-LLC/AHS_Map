import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '../firebase'
import { stylesLight } from '../styles/light/HomeLight'
// import { stylesDark } from '../styles/dark/HomeDark'
import WavyHeader from '../components/headers/WavyHeader'
import HomeCarousel from '../components/cards/HomeCarousel';

export default function Home({userId, navigation}) {
  const [firstName, setFirstName] = useState('');
  let styles = stylesLight;

  useEffect(() => {
    const fetchFirstName = async () => {
      try {
        if (userId) {
          const userDocRef = doc(db, 'users', userId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setFirstName(userData.firstName);
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

    fetchFirstName();
    
  }, [userId]);


  return (
    <View style={styles.fullScreen}>
        <WavyHeader 
          customHeight={15}
          customTop={10}
          customImageDimensions={20}
        />
            <View style={styles.container}>
                <Text style={styles.bigText}> Hello, {firstName} </Text>

                <HomeCarousel userId={userId} navigation={navigation} />
            </View>
        </View>
  );
};
