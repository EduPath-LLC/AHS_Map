import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
export default function SignIn() {
    return (
      <View style={styles.container}>
        <View>
        <StatusBar style="auto" />
        <Text style>Sign In</Text>
        </View>
       </View>
      
    );
  }