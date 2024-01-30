import * as React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import FeatherIcon from 'react-native-vector-icons/Feather'
import Availibilty from "../screens/Availibilty";
import Map from "../screens/Map";
import Settings from "../screens/Settings";
import Schedule from "../screens/Schedule";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
    return(
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
        
                    if (route.name === 'Map') {
                      iconName = focused
                        ? 'map'
                        : 'map-outline';
                    } else if (route.name === 'Availibility') {
                      iconName = focused 
                        ? 'time' 
                        : 'time-outline';
                    } else if (route.name === 'Schedule') {
                        iconName = focused 
                          ? 'calendar' 
                          : 'calendar-outline';
                    }
                    else if (route.name === 'Settings') {
                        iconName = focused 
                          ? 'settings' 
                          : 'settings-outline';
                    }
                                      
                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
                headerShown: false
            })}
        >
            <Tab.Screen name="Map" component={Map} />
            <Tab.Screen name="Availibility" component={Availibilty} />
            <Tab.Screen name="Schedule" component={Schedule} />
            <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
    );
}