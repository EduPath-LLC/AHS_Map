import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, SafeAreaView} from 'react-native';

export default function Schedule({navigation}) {

    return (
        <SafeAreaView style={styles.container}>
  
        <StatusBar
           barStyle = "dark-content" 
           backgroundColor = "#3091BE" 
           translucent = {true}
        />
  
          <View>
  
          <Text style={styles.titlem}>AHS Map and Availibilty</Text>
          <Text style={styles.titlez}> Schedule </Text>
          <Text style={styles.textNorm}>Period 1</Text>
          <Text style={styles.textNorm2}>9:43 - 11:16</Text>
          <Text style={styles.textNorm3}>Period 2</Text>
          <Text style={styles.textNorm4}>9:43 - 11:16</Text>
          <Text style={styles.textNorm5}>Period 5</Text>
          <Text style={styles.textNorm6}>11:22 - 1:28</Text>
          <Text style={styles.textNorm7}>Period 3</Text>
          <Text style={styles.textNorm8}>11:22 - 1:28</Text>
          <Text style={styles.textNorm9}>Period 6</Text>
          <Text style={styles.textNorm10}>1:35 - 3:08</Text>
          <Text style={styles.textNorm11}>Period 4</Text>
          <Text style={styles.textNorm12}>1:35 - 3:08</Text>
          <Text style={styles.textNorm13}>Period 7</Text>
          <Text style={styles.textNorm14}>3:14 - 4:05</Text>
          <Text style={styles.textNorm15}>Period 8</Text>
          <Text style={styles.textNorm16}>8:45 - 9:37</Text>
          <Text style={styles.textNorm17}>A: 11:28 - 11:58</Text>
          <Text style={styles.textNorm18}>B: 11:58 - 12:28</Text>
          <Text style={styles.textNorm19}>C: 12:28 - 12:58</Text>
          <Text style={styles.textNorm20}>D: 12:58 - 1:28</Text>
          <Text style={styles.textNorm21}>A: 11:28 - 11:58</Text>
          <Text style={styles.textNorm22}>B: 11:58 - 12:28</Text>
          <Text style={styles.textNorm23}>C: 12:28 - 12:58</Text>
          <Text style={styles.textNorm24}>D: 12:58 - 1:28</Text>
          <Text style={styles.textNorm25}>A-Day</Text>
          <Text style={styles.textNorm26}>B-Day</Text>
          <View style={styles.rectangle}></View>
          <View style={styles.rectangle2}></View>
          <View style={styles.rectangle3}></View>
          <View style={styles.rectangle4}></View>
          <View style={styles.rectangle5}></View>
          <View style={styles.rectangle6}></View>
          <View style={styles.rectangle7}></View>
          <View style={styles.rectangle8}></View>
          <View style={styles.rectangle9}></View>
          <View style={styles.rectangle10}></View>
          <View style={styles.rectangle11}></View>
  
          </View>
  
        </SafeAreaView>
        
      );
    }
    
  
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'top',
      },
      rectangle: {
          height: 500,
          width: 300, 
          backgroundColor: '#f2f2f2',
          //position: 'absolute',
          zIndex: 99,
          top: 30,
          left: 22.5,
          //borderRadius: 9,
          borderColor: 'black',
          borderWidth: 2,
          position: 'relative',
         },
         rectangle2: {
            height: 70,
            width: 300, 
            backgroundColor: 'transparent',
            //position: 'absolute',
            zIndex: 99,
            top: -470,
            left: 22.5,
            //borderRadius: 9,
            borderColor: 'black',
            borderWidth: 1,
            position: 'relative',
           },
           rectangle3: {
            height: 70,
            width: 150, 
            backgroundColor: 'transparent',
            //position: 'absolute',
            zIndex: 99,
            top: -470,
            left: 22.5,
            //borderRadius: 9,
            borderColor: 'black',
            borderWidth: 1,
            position: 'relative',
           },
           rectangle4: {
            height: 70,
            width: 150, 
            backgroundColor: 'transparent',
            //position: 'absolute',
            zIndex: 99,
            top: -540,
            left: 172.5,
            //borderRadius: 9,
            borderColor: 'black',
            borderWidth: 1,
            position: 'relative',
           },
           rectangle5: {
            height: 170,
            width: 150, 
            backgroundColor: 'transparent',
            //position: 'absolute',
            zIndex: 99,
            top: -540,
            left: 22.5,
            //borderRadius: 9,
            borderColor: 'black',
            borderWidth: 1,
            position: 'relative',
           },
           rectangle6: {
            height: 170,
            width: 150, 
            backgroundColor: 'transparent',
            //position: 'absolute',
            zIndex: 99,
            top: -710,
            left: 172.5,
            //borderRadius: 9,
            borderColor: 'black',
            borderWidth: 1,
            position: 'relative',
           },
           rectangle7: {
            height: 70,
            width: 150, 
            backgroundColor: 'transparent',
            //position: 'absolute',
            zIndex: 99,
            top: -710,
            left: 22.5,
            //borderRadius: 9,
            borderColor: 'black',
            borderWidth: 1,
            position: 'relative',
           },
           rectangle8: {
            height: 70,
            width: 150, 
            backgroundColor: 'transparent',
            //position: 'absolute',
            zIndex: 99,
            top: -780,
            left: 172.5,
            //borderRadius: 9,
            borderColor: 'black',
            borderWidth: 1,
            position: 'relative',
           },
           rectangle9: {
            height: 70,
            width: 300, 
            backgroundColor: 'transparent',
            //position: 'absolute',
            zIndex: 99,
            top: -780,
            left: 22.5,
            //borderRadius: 9,
            borderColor: 'black',
            borderWidth: 1,
            position: 'relative',
           },
           rectangle10: {
            height: 50,
            width: 150, 
            backgroundColor: 'dodgerblue',
            //position: 'absolute',
            zIndex: 99,
            top: -780,
            left: 22.5,
            //borderRadius: 9,
            borderColor: 'black',
            borderWidth: 2,
            position: 'relative',
           },
           rectangle11: {
            height: 50,
            width: 150, 
            backgroundColor: 'red',
            //position: 'absolute',
            zIndex: 99,
            top: -830,
            left: 172.5,
            //borderRadius: 9,
            borderColor: 'black',
            borderWidth: 2,
            position: 'relative',
           },
           textNorm: {
            margin: 0,
            paddingVertical: 8,
            //borderWidth: 4,
            borderColor: 'blue',
            borderRadius: 6,
            color: 'black',
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 700,
            //fontStyle: 'italic'
            top: 175,
            left: 140,
            position: 'absolute',
            zIndex: 999,
            textAlign: 'center',
            },
            textNorm2: {
                margin: 0,
                paddingVertical: 8,
                //borderWidth: 4,
                borderColor: 'blue',
                borderRadius: 6,
                color: 'black',
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 700,
                //fontStyle: 'italic'
                top: 260,
                left: 195,
                position: 'absolute',
                zIndex: 999,
                textAlign: 'center',
                },
                textNorm3: {
                    margin: 0,
                    paddingVertical: 8,
                    //borderWidth: 4,
                    borderColor: 'blue',
                    borderRadius: 6,
                    color: 'black',
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: 700,
                    //fontStyle: 'italic'
                    top: 235,
                    left: 60,
                    position: 'absolute',
                    zIndex: 999,
                    textAlign: 'center',
                    },         
                    textNorm4: {
                        margin: 0,
                        paddingVertical: 8,
                        //borderWidth: 4,
                        borderColor: 'blue',
                        borderRadius: 6,
                        color: 'black',
                        textAlign: 'center',
                        fontSize: 20,
                        fontWeight: 700,
                        //fontStyle: 'italic'
                        top: 260,
                        left: 45,
                        position: 'absolute',
                        zIndex: 999,
                        textAlign: 'center',
                        },
                        textNorm5: {
                            margin: 0,
                            paddingVertical: 8,
                            //borderWidth: 4,
                            borderColor: 'blue',
                            borderRadius: 6,
                            color: 'black',
                            textAlign: 'center',
                            fontSize: 20,
                            fontWeight: 700,
                            //fontStyle: 'italic'
                            top: 235,
                            left: 210,
                            position: 'absolute',
                            zIndex: 999,
                            textAlign: 'center',
                            },
                            textNorm6: {
                                margin: 0,
                                paddingVertical: 8,
                                //borderWidth: 4,
                                borderColor: 'blue',
                                borderRadius: 6,
                                color: 'black',
                                textAlign: 'center',
                                fontSize: 20,
                                fontWeight: 700,
                                //fontStyle: 'italic'
                                top: 330,
                                left: 45,
                                position: 'absolute',
                                zIndex: 999,
                                textAlign: 'center',
                                },         
                                textNorm7: {
                                    margin: 0,
                                    paddingVertical: 8,
                                    //borderWidth: 4,
                                    borderColor: 'blue',
                                    borderRadius: 6,
                                    color: 'black',
                                    textAlign: 'center',
                                    fontSize: 20,
                                    fontWeight: 700,
                                    //fontStyle: 'italic'
                                    top: 305,
                                    left: 60,
                                    position: 'absolute',
                                    zIndex: 999,
                                    textAlign: 'center',
                                    },
                                    textNorm8: {
                                        margin: 0,
                                        paddingVertical: 8,
                                        //borderWidth: 4,
                                        borderColor: 'blue',
                                        borderRadius: 6,
                                        color: 'black',
                                        textAlign: 'center',
                                        fontSize: 20,
                                        fontWeight: 700,
                                        //fontStyle: 'italic'
                                        top: 330,
                                        left: 195,
                                        position: 'absolute',
                                        zIndex: 999,
                                        textAlign: 'center',
                                        },
                                        textNorm9: {
                                            margin: 0,
                                            paddingVertical: 8,
                                            //borderWidth: 4,
                                            borderColor: 'blue',
                                            borderRadius: 6,
                                            color: 'black',
                                            textAlign: 'center',
                                            fontSize: 20,
                                            fontWeight: 700,
                                            //fontStyle: 'italic'
                                            top: 305,
                                            left: 210,
                                            position: 'absolute',
                                            zIndex: 999,
                                            textAlign: 'center',
                                            },
                                            textNorm10: {
                                                margin: 0,
                                                paddingVertical: 8,
                                                //borderWidth: 4,
                                                borderColor: 'blue',
                                                borderRadius: 6,
                                                color: 'black',
                                                textAlign: 'center',
                                                fontSize: 20,
                                                fontWeight: 700,
                                                //fontStyle: 'italic'
                                                top: 500,
                                                left: 45,
                                                position: 'absolute',
                                                zIndex: 999,
                                                textAlign: 'center',
                                                },
                                                textNorm11: {
                                                    margin: 0,
                                                    paddingVertical: 8,
                                                    //borderWidth: 4,
                                                    borderColor: 'blue',
                                                    borderRadius: 6,
                                                    color: 'black',
                                                    textAlign: 'center',
                                                    fontSize: 20,
                                                    fontWeight: 700,
                                                    //fontStyle: 'italic'
                                                    top: 475,
                                                    left: 60,
                                                    position: 'absolute',
                                                    zIndex: 999,
                                                    textAlign: 'center',
                                                    },
                                                    textNorm12: {
                                                        margin: 0,
                                                        paddingVertical: 8,
                                                        //borderWidth: 4,
                                                        borderColor: 'blue',
                                                        borderRadius: 6,
                                                        color: 'black',
                                                        textAlign: 'center',
                                                        fontSize: 20,
                                                        fontWeight: 700,
                                                        //fontStyle: 'italic'
                                                        top: 500,
                                                        left: 195,
                                                        position: 'absolute',
                                                        zIndex: 999,
                                                        textAlign: 'center',
                                                        },
                                                        textNorm13: {
                                                            margin: 0,
                                                            paddingVertical: 8,
                                                            //borderWidth: 4,
                                                            borderColor: 'blue',
                                                            borderRadius: 6,
                                                            color: 'black',
                                                            textAlign: 'center',
                                                            fontSize: 20,
                                                            fontWeight: 700,
                                                            //fontStyle: 'italic'
                                                            top: 475,
                                                            left: 210,
                                                            position: 'absolute',
                                                            zIndex: 999,
                                                            textAlign: 'center',
                                                            },
                                                            textNorm14: {
                                                                margin: 0,
                                                                paddingVertical: 8,
                                                                //borderWidth: 4,
                                                                borderColor: 'blue',
                                                                borderRadius: 6,
                                                                color: 'black',
                                                                textAlign: 'center',
                                                                fontSize: 20,
                                                                fontWeight: 700,
                                                                //fontStyle: 'italic'
                                                                top: 570,
                                                                left: 130,
                                                                position: 'absolute',
                                                                zIndex: 999,
                                                                textAlign: 'center',
                                                                },
                                                                textNorm15: {
                                                                    margin: 0,
                                                                    paddingVertical: 8,
                                                                    //borderWidth: 4,
                                                                    borderColor: 'blue',
                                                                    borderRadius: 6,
                                                                    color: 'black',
                                                                    textAlign: 'center',
                                                                    fontSize: 20,
                                                                    fontWeight: 700,
                                                                    //fontStyle: 'italic'
                                                                    top: 545,
                                                                    left: 140,
                                                                    position: 'absolute',
                                                                    zIndex: 999,
                                                                    textAlign: 'center',
                                                                    },
                                                                    textNorm16: {
                                                                        margin: 0,
                                                                        paddingVertical: 8,
                                                                        //borderWidth: 4,
                                                                        borderColor: 'blue',
                                                                        borderRadius: 6,
                                                                        color: 'black',
                                                                        textAlign: 'center',
                                                                        fontSize: 20,
                                                                        fontWeight: 700,
                                                                        //fontStyle: 'italic'
                                                                        top: 200,
                                                                        left: 130,
                                                                        position: 'absolute',
                                                                        zIndex: 999,
                                                                        textAlign: 'center',
                                                                        },
                                                                        textNorm17: {
                                                                            margin: 0,
                                                                            paddingVertical: 8,
                                                                            //borderWidth: 4,
                                                                            borderColor: 'blue',
                                                                            borderRadius: 6,
                                                                            color: 'black',
                                                                            textAlign: 'center',
                                                                            fontSize: 20,
                                                                            fontWeight: 700,
                                                                            //fontStyle: 'italic'
                                                                            top: 360,
                                                                            left: 30,
                                                                            position: 'absolute',
                                                                            zIndex: 999,
                                                                            textAlign: 'center',
                                                                            },
                                                                            textNorm18: {
                                                                                margin: 0,
                                                                                paddingVertical: 8,
                                                                                //borderWidth: 4,
                                                                                borderColor: 'blue',
                                                                                borderRadius: 6,
                                                                                color: 'black',
                                                                                textAlign: 'center',
                                                                                fontSize: 20,
                                                                                fontWeight: 700,
                                                                                //fontStyle: 'italic'
                                                                                top: 380,
                                                                                left: 30,
                                                                                position: 'absolute',
                                                                                zIndex: 999,
                                                                                textAlign: 'center',
                                                                                },
                                                                                textNorm19: {
                                                                                    margin: 0,
                                                                                    paddingVertical: 8,
                                                                                    //borderWidth: 4,
                                                                                    borderColor: 'blue',
                                                                                    borderRadius: 6,
                                                                                    color: 'black',
                                                                                    textAlign: 'center',
                                                                                    fontSize: 20,
                                                                                    fontWeight: 700,
                                                                                    //fontStyle: 'italic'
                                                                                    top: 400,
                                                                                    left: 30,
                                                                                    position: 'absolute',
                                                                                    zIndex: 999,
                                                                                    textAlign: 'center',
                                                                                    },
                                                                                    textNorm20: {
                                                                                        margin: 0,
                                                                                        paddingVertical: 8,
                                                                                        //borderWidth: 4,
                                                                                        borderColor: 'blue',
                                                                                        borderRadius: 6,
                                                                                        color: 'black',
                                                                                        textAlign: 'center',
                                                                                        fontSize: 20,
                                                                                        fontWeight: 700,
                                                                                        //fontStyle: 'italic'
                                                                                        top: 420,
                                                                                        left: 30,
                                                                                        position: 'absolute',
                                                                                        zIndex: 999,
                                                                                        textAlign: 'center',
                                                                                        },
                                                                                        textNorm21: {
                                                                                            margin: 0,
                                                                                            paddingVertical: 8,
                                                                                            //borderWidth: 4,
                                                                                            borderColor: 'blue',
                                                                                            borderRadius: 6,
                                                                                            color: 'black',
                                                                                            textAlign: 'center',
                                                                                            fontSize: 20,
                                                                                            fontWeight: 700,
                                                                                            //fontStyle: 'italic'
                                                                                            top: 360,
                                                                                            left: 180,
                                                                                            position: 'absolute',
                                                                                            zIndex: 999,
                                                                                            textAlign: 'center',
                                                                                            },
                                                                                            textNorm22: {
                                                                                                margin: 0,
                                                                                                paddingVertical: 8,
                                                                                                //borderWidth: 4,
                                                                                                borderColor: 'blue',
                                                                                                borderRadius: 6,
                                                                                                color: 'black',
                                                                                                textAlign: 'center',
                                                                                                fontSize: 20,
                                                                                                fontWeight: 700,
                                                                                                //fontStyle: 'italic'
                                                                                                top: 380,
                                                                                                left: 180,
                                                                                                position: 'absolute',
                                                                                                zIndex: 999,
                                                                                                textAlign: 'center',
                                                                                                },
                                                                                                textNorm23: {
                                                                                                    margin: 0,
                                                                                                    paddingVertical: 8,
                                                                                                    //borderWidth: 4,
                                                                                                    borderColor: 'blue',
                                                                                                    borderRadius: 6,
                                                                                                    color: 'black',
                                                                                                    textAlign: 'center',
                                                                                                    fontSize: 20,
                                                                                                    fontWeight: 700,
                                                                                                    //fontStyle: 'italic'
                                                                                                    top: 400,
                                                                                                    left: 180,
                                                                                                    position: 'absolute',
                                                                                                    zIndex: 999,
                                                                                                    textAlign: 'center',
                                                                                                    },
                                                                                                    textNorm24: {
                                                                                                        margin: 0,
                                                                                                        paddingVertical: 8,
                                                                                                        //borderWidth: 4,
                                                                                                        borderColor: 'blue',
                                                                                                        borderRadius: 6,
                                                                                                        color: 'black',
                                                                                                        textAlign: 'center',
                                                                                                        fontSize: 20,
                                                                                                        fontWeight: 700,
                                                                                                        //fontStyle: 'italic'
                                                                                                        top: 420,
                                                                                                        left: 180,
                                                                                                        position: 'absolute',
                                                                                                        zIndex: 999,
                                                                                                        textAlign: 'center',
                                                                                                        },
                                                                                                        textNorm25: {
                                                                                                            margin: 0,
                                                                                                            paddingVertical: 8,
                                                                                                            //borderWidth: 4,
                                                                                                            borderColor: 'blue',
                                                                                                            borderRadius: 6,
                                                                                                            color: 'black',
                                                                                                            textAlign: 'center',
                                                                                                            fontSize: 20,
                                                                                                            fontWeight: 700,
                                                                                                            //fontStyle: 'italic'
                                                                                                            top: 625,
                                                                                                            left: 70,
                                                                                                            position: 'absolute',
                                                                                                            zIndex: 999,
                                                                                                            textAlign: 'center',
                                                                                                            },
                                                                                                            textNorm26: {
                                                                                                                margin: 0,
                                                                                                                paddingVertical: 8,
                                                                                                                //borderWidth: 4,
                                                                                                                borderColor: 'blue',
                                                                                                                borderRadius: 6,
                                                                                                                color: 'black',
                                                                                                                textAlign: 'center',
                                                                                                                fontSize: 20,
                                                                                                                fontWeight: 700,
                                                                                                                //fontStyle: 'italic'
                                                                                                                top: 625,
                                                                                                                left: 220,
                                                                                                                position: 'absolute',
                                                                                                                zIndex: 999,
                                                                                                                textAlign: 'center',
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
          //fontWeight: 'bold',
          fontWeight: 300,
          color: 'blue',
          alignSelf: "center"
        },
        titlem: {
          margin: 20,
          paddingVertical: 8,
          //borderWidth: 4,
          borderColor: 'blue',
          borderRadius: 6,
          color: 'blue',
          textAlign: 'center',
          fontSize: 30,
          fontWeight: 700,
          //fontStyle: 'italic'
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
            //fontWeight: 'bold',
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

