import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Alert} from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import { auth } from '../Firebase';


    
export default function SignUp({navigation}) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pw2, setpw2] = useState('')

  registerUser = async (email, password) => {
    if(password != pw2){
      Alert.alert("Error", "Passwords Don't Match")
    } else{
      try {
        await createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential=>userCredential.user)
        .then(user=>{sendEmailVerification(user)})
        .then(() => 
              navigation.navigate("Verification"),
              Alert.alert('Email Sent')
        )
        
      } catch (e) {
        Alert.alert("Error", e.message)
      }
    }
  }
    return (
      <SafeAreaView style={styles.container}>

      <StatusBar
         barStyle = "dark-content" 
         backgroundColor = "#3091BE" 
         translucent = {true}
      />

        <View>
        <StatusBar style="auto" />
        <Text style={styles.titlem}>AHS Map and Availibilty</Text>
        <Text style={styles.titlez}>Sign up</Text>
        <TextInput style={[styles.input, {padding: 10}]}
                            autoCapitalize="none"
                            placeholder="Enter Email"
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeText={(text) => setEmail(text)}
                        />
        
        <TextInput style={[styles.input, {padding: 10}]}
                        autoCapitalize="none"
                        placeholder="Enter Password"
                        autoCorrect={false}
                        secureTextEntry={true}
                        onChangeText={(text) => setPassword(text)}
                        />
        

        <TextInput style={[styles.input, {padding: 10}]}
                        autoCapitalize="none"
                        placeholder="Enter Password Again"
                        autoCorrect={false}
                        secureTextEntry={true}
                        onChangeText={(text) => setpw2(text)}
                        />    
                        

    </View>

    <View>

       <TouchableOpacity 
        style={styles.button}
        onPress = {() => registerUser(email, password) }
       > 
          <Text> Sign Up </Text>

        </TouchableOpacity>
       
        </View>

        <Text style={{color: "red", fontSize: 15}} onPress={() => navigation.navigate("SignIn")}> Already have an Account? Sign In! </Text>

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
        marginTop: 100,
        width: 150,
        alignItems: "center",
        padding: 20,
        borderRadius: 50,
        backgroundColor: "#FFFFFF",
        marginBottom: 25
       }
});