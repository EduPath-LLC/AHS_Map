import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';
export default function SignUp() {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text style={styles.titlez}>Sign up</Text>
        <Text style={styles.titlem}>AHS Map and Availibilty</Text>
        {/* <View style={styles.rectangle}/> */}
        <TextInput style={[styles.input, {padding: 10}]}
                            autoCapitalize="none"
                            placeholder="Enter Username"
                            autoCorrect={false}
                            secureTextEntry={false}
                           
                            
                            
                        />
        
        <TextInput style={[styles.input, {padding: 10}]}
                        autoCapitalize="none"
                        placeholder="Enter Password"
                        autoCorrect={false}
                        secureTextEntry={true}
                        />
                        <TextInput style={[styles.input, {padding: 10}]}
                        autoCapitalize="none"
                        placeholder="Enter Password Again"
                        autoCorrect={false}
                        secureTextEntry={true}
                        />
                        <Button 
        title="Press me"
        color="#f194ff"
        onPress={() => Alert.alert('Button with adjusted color pressed')}
      />
                        
      </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      alignItems: 'center',
      justifyContent: 'top',
    },
    rectangle: {
        height: 50,
        width: 380, 
        backgroundColor: 'white',
        position: 'absolute',
        zIndex: 99,
        top: '27%',
    left: '5%'
       },
       input: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: 'black',
        width: 350,
        height: 80,
        top: '18%'
       },
       input: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: 'black',
        width: 350,
        height: 80,
        margin: 20,
        top: '18%'
       },
       input: {
        backgroundColor: 'white',
        borderRadius: 20,
        borderColor: 'black',
        borderWidth: 8,
        width: 350,
        height: 80,
        margin: 20,
        top: '18%'},
        titlez: {
          fontSize: 40,
          top: '28%',
          fontWeight: 'bold',
          color: 'white'
        },
        titlem: {
          marginTop: 16,
          paddingVertical: 8,
          borderWidth: 4,
          borderColor: 'red',
          borderRadius: 6,
          
          color: 'white',
          textAlign: 'center',
          fontSize: 30,
          fontWeight: 'bold',
          fontStyle: 'italic'
        }
       
  });