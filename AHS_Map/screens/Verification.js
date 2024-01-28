import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar} from 'react-native';


    
export default function Verification({navigation}) {
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
        <Text style={styles.titlez}> Verification </Text>
        

        <Text style={styles.text}>Please Check Your Email and Verify your account. </Text>
        <Text style={styles.text}>Also Check the Spam Folder just in case </Text>
        <Text style={styles.text}>Go the The Sign in Page to Login In </Text>

    </View>

    <View>

       <TouchableOpacity 
        style={styles.button}
        onPress = {() => navigation.navigate('SignIn') }
       > 
          <Text> Sign In Page </Text>

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
        marginTop: 50,
        width: 150,
        alignItems: "center",
        padding: 20,
        borderRadius: 50,
        backgroundColor: "#FFFFFF",
        marginBottom: 25
       },
      text: {
        margin: 10,
        padding: 5,
        alignSelf: "center",
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
        justifyContent: "center"
      }
  });