import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../Firebase';

export default function SignIn({navigation}) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onHandleSignIn = () => {
      if (email !== "" && password !== "") {
          signInWithEmailAndPassword(auth, email, password)
              .then(cred => {
                  if (!cred.user.emailVerified){
                      console.log("hello");
                      navigation.navigate("HomePage");
                  }
              }
              )
              .catch((err) => Alert.alert("Login error", err.message));
      }
  };


    return (
      <View style={styles.container}>
        <View>
        <StatusBar style="auto" />
        <Text style={styles.titlem}>AHS Map and Availibilty</Text>
        <Text style={styles.titlez}>Sign In</Text>
        <TextInput style={[styles.input, {padding: 10}]}
                            autoCapitalize="none"
                            placeholder="Enter Username"
                            autoCorrect={false}
                            secureTextEntry={false}
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            
                            
                        />
        
        <TextInput style={[styles.input, {padding: 10}]}
                        autoCapitalize="none"
                        placeholder="Enter Password"
                        autoCorrect={false}
                        secureTextEntry={true}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        />
                        

    </View>

    <View>

       <TouchableOpacity 
        style={styles.button}
        onPress = {onHandleSignIn}
       > 
          <Text> Sign Up </Text>
        </TouchableOpacity>

       
        </View>

      </View>
      
    );
  
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F84F10',
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
        borderRadius: 20,
        width: 350,
        height: 80,
        margin: 20,
        top: '18%'
      },
      titlez: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        alignSelf: "center"
      },
      titlem: {
        margin: 15,
        paddingVertical: 8,
        borderWidth: 4,
        borderColor: 'red',
        borderRadius: 6,
        color: 'white',
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        fontStyle: 'italic'
        },
       button: {
        
        width: 150,
        alignItems: "center",
        top: 100,
        padding: 20,
        borderRadius: 50,
        backgroundColor: "#00BC9C"
       }
  });