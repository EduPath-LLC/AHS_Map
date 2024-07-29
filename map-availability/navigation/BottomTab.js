import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'

import Home from '../screens/Home';
import Map from '../screens/Map';
// import Availability from '../screens/Availability';
import Settings from '../screens/Settings';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  const route = useRoute();
  const { userId } = route.params;
  const [darkMode, setDarkMode] = useState(true);
  let inactive = darkMode ? "#ffffff" : "#000000"
  let bg = darkMode ? '#243741' : '#ffffff'

  useEffect(() => {
    const isDarkMode = async () => {
      try {
        if (userId) {
          const userDocRef = doc(db, 'users', userId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();

            if(userData.dark) {
              setDarkMode(true)
            } else {
              setDarkMode(false)
            }

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

    isDarkMode();

    const interval = setInterval(isDarkMode, 2000);

    return () => clearInterval(interval);
  }, [userId]);

  return (
    <Tab.Navigator 
      initialRouteName="Home" 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />;
          } else if (route.name === 'Map') {
            return <FontAwesome6 name={focused ? 'map-location-dot' : 'map-location-dot'} size={size} color={color} />;
          } else if (route.name === 'Availability') {
            return <FontAwesome5 name={focused ? 'calendar-check' : 'calendar-check'} size={size} color={color} />;
          } else if (route.name === 'Settings') {
            return <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: inactive,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: bg,
        },
        tabBarShowLabel: false
      })}
    >
      <Tab.Screen name="Home">
        {props => <Home {...props} userId={userId} />}
      </Tab.Screen>
      <Tab.Screen name="Map" userId={userId} >
        {props => <Map {...props} userId={userId} />}
      </Tab.Screen>
      {/* <Tab.Screen name="Availability" userId={Availability} >
        {props => <Availability {...props} userId={userId} />}
      </Tab.Screen> */}
      <Tab.Screen name="Settings">
        {props => <Settings {...props} userId={userId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
