import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SignUp from "./screens/SignUp"
import SignIn from "./screens/SignIn"
import TabNavigation from './navigation/TabNavigation';
import ResetPassword from './screens/ResetPassword';
import Verification from './screens/Verification';
import Schedule from './screens/Schedule';
import EditSchedule from './screens/EditSchedule';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>

      <Stack.Navigator 
      initialRouteName="SignIn" 
      screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Verification" component={Verification} />
        <Stack.Screen name="TabNavigation" component={TabNavigation} />
        <Stack.Screen name="Schedule" component={Schedule} />
        <Stack.Screen name="EditSchedule" component={EditSchedule} />
      </Stack.Navigator>
      
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

