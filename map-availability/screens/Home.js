import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';


import { db } from '../firebase'
import { styles } from '../styles/light/HomeLight'
import WavyHeader from '../components/headers/WavyHeader'

export default function Home({userId}) {
  const [firstName, setFirstName] = useState('');

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
                <Text style={styles.bigText}> Hello {firstName} </Text>
            </View>
        </View>
  );
};
