import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Alert} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../Firebase';


    
export default function ResetPassword({navigation}) {
  const [email, setEmail] = useState("");

  const handlePasswordChange = async () => {
    if(email == ""){
      Alert.alert("Error", "Please Enter an Email")
    } else {
      try{
        await sendPasswordResetEmail(auth, email)
          .then(() => {
            Alert.alert("Email Sent")
        }
      )
      } catch (err) {
        Alert.alert("Error", err.message)
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
        <Text style={styles.titlez}> Reset Password </Text>


        <TextInput style={[styles.input, {padding: 10}]}
                            autoCapitalize="none"
                            placeholder="Enter Username"
                            autoCorrect={false}
                            secureTextEntry={false}
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
        
        
                        

    </View>

    <View>

       <TouchableOpacity 
        style={styles.button}
        onPress = {handlePasswordChange }
       > 
          <Text> Send Email </Text>

        </TouchableOpacity>
       
        </View>

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