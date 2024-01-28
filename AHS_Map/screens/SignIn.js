import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, StatusBar, SafeAreaView} from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../Firebase';

export default function SignIn({navigation}) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onHandleSignIn = () => {
      if (email !== "" && password !== "") {
          signInWithEmailAndPassword(auth, email, password)
              .then(cred => {
                  if (cred.user.emailVerified){
                      navigation.navigate("TabNavigation");
                  }
              }
              )
              .catch((err) => Alert.alert("Login Error", err.message));
      } else {
        Alert.alert("Login Error", "Please Make Sure All Fields are Filled")
      }
  };


    return (
      <SafeAreaView style={styles.container}>

      <StatusBar
         barStyle = "dark-content" 
         backgroundColor = "#3091BE" 
         translucent = {true}
      />

        <View>

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

    <Text style={{color: "red", fontSize: 15, marginTop: 60, alignSelf: "flex-end", right: 30}} onPress={() => navigation.navigate("ResetPassword")}> Forgot Password? </Text>

    <View>

       <TouchableOpacity 
        style={styles.button}
        onPress = {onHandleSignIn}
       > 
          <Text> Sign In </Text>
        
        </TouchableOpacity>
       
       
    </View>

    <Text style={{color: "red", fontSize: 15}} onPress={() => navigation.navigate("SignUp")}> Don't Have an Account, Sign Up! </Text>

    
    </SafeAreaView>
      
    );
  
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#3091BE',
      alignItems: 'center',
      justifyContent: 'top',
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
        borderColor: 'white',
        borderRadius: 6,
        color: 'white',
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        fontStyle: 'italic'
        },
       button: {
        marginTop: 75,
        width: 150,
        alignItems: "center",
        padding: 20,
        borderRadius: 50,
        backgroundColor: "#FFFFFF",
        marginBottom: 25
       }
  });