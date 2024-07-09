import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LocationProvider } from './components/LocationContext';
import SignUp from './screens/auth/SignUp.js'
import SignIn from './screens/auth/SignIn.js';
import BottomTab from './navigation/BottomTab.js';
import ResetPassword from './screens/auth/ResetPassword.js';
import SetSchedule from './screens/SetSchedule.js';

const Stack = createStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator 
    initialRouteName="SignIn" 
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="SignUp" component={SignUp} />
    <Stack.Screen name="ResetPassword" component={ResetPassword} />
    <Stack.Screen name="SetSchedule" component={SetSchedule} />
    <Stack.Screen name="BottomTab" component={BottomTab} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <LocationProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <MainNavigator />
      </NavigationContainer>
    </LocationProvider>
  );
}