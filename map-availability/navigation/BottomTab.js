import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';

import Home from '../screens/Home';
import Map from '../screens/Map';
import Availability from '../screens/Availability';
import Settings from '../screens/Settings';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
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
                tabBarActiveTintColor: '#83B5FF',
                tabBarInactiveTintColor: '#000000',
                headerShown: false,
              })}
            >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Map" component={Map} />
          <Tab.Screen name="Availability" component={Availability} />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
      );
}
