import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

export default function HomePage({navigation}) {

    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text style={styles.titlem}>AHS Map and Availibilty</Text>
        <Text style={styles.titlez}>Home Page</Text>
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