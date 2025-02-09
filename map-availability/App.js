import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LocationProvider } from './components/providers/LocationContext.js';
import SignUp from './screens/auth/SignUp.js'
import SignIn from './screens/auth/SignIn.js';
import BottomTab from './navigation/BottomTab.js';
import ResetPassword from './screens/auth/ResetPassword.js';
import SetSchedule from './screens/SetSchedule.js';
import Account from './screens/Account.js'
import Notifications from './screens/Notifications.js'
import Appearance from './screens/Appearance.js';
import HelpAndSupport from './screens/HelpAndSupport.js'
import About from './screens/About.js'
import PrivacyPolicy from './screens/PrivacyPolicy.js'
import Back from './screens/auth/Back.js';

const Stack = createStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator 
    initialRouteName="SignIn" 
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="SignIn" component={SignIn} options={{gestureEnabled: false}} />
    <Stack.Screen name="SignUp" component={SignUp} options={{gestureEnabled: false}} />
    <Stack.Screen name="Back" component={Back} options={{gestureEnabled: false}} />
    <Stack.Screen name="ResetPassword" component={ResetPassword} options={{gestureEnabled: false}} />
    <Stack.Screen name="SetSchedule" component={SetSchedule} options={{gestureEnabled: false}} />
    <Stack.Screen name="BottomTab" component={BottomTab} options={{gestureEnabled: false}} />
    <Stack.Screen name="Account" component={Account} options={{gestureEnabled: false}} />
    <Stack.Screen name="Notifications" component={Notifications} options={{gestureEnabled: false}} />
    <Stack.Screen name="Appearance" component={Appearance} options={{gestureEnabled: false}} />
    <Stack.Screen name="HelpAndSupport" component={HelpAndSupport} options={{gestureEnabled: false}} />
    <Stack.Screen name="About" component={About} options={{gestureEnabled: false}} />
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{gestureEnabled: false}} />
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