import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, SafeAreaView} from 'react-native';


export default function Availibilty({navigation}) {

    return (
      <SafeAreaView style={styles.container}>

      <StatusBar
         barStyle = "dark-content" 
         backgroundColor = "#3091BE" 
         translucent = {true}
      />

        <View style={{marginTop: 25}}>

        <Text style={styles.titlem}>AHS Map and Availibilty</Text>
        <Text style={styles.titlez}> Availibilty </Text>

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
        margin: 20,
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
        titlep: {
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
        
        width: 150,
        alignItems: "center",
        top: 100,
        padding: 20,
        borderRadius: 50,
        backgroundColor: "#00BC9C"
       }
  });