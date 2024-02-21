import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, StatusBar, SafeAreaView} from 'react-native';
import { auth, db } from '../Firebase';
import { doc, setDoc } from "firebase/firestore";


export default function EditSchedule({navigation}) {
    const buildings = ["AHS", "LFC", "STEAM"]

    const [email, setEmail] = useState('')

    const [one, setOne] = useState('')
    const [two, setTwo] = useState('')
    const [three, setThree] = useState('')
    const [four, setFour] = useState('')
    const [five, setFive] = useState('')
    const [six, setSix] = useState('')
    const [seven, setSeven] = useState('')
    const [eight, setEight] = useState('')

    const handleEdit = async (one, two, three, four, five, six, seven, eight, email) => {
        await setDoc(doc(db, "users", email), {
            email: email,
            role: "student",
            FirstPeriod: one,
            SecondPeriod: two,
            ThirdPeriod: three,
            FourthPeriod: four,
            FifthPeriod: five,
            SixthPeriod: six,
            SeventhPeriod: seven,
            EightPeriod: eight,
          });
    }


    return (
      <SafeAreaView style={styles.container}>

      <StatusBar
         barStyle = "dark-content" 
         backgroundColor = "#3091BE" 
         translucent = {true}
      />

        <View>

        <Text style={styles.titlem}>AHS Map and Availibilty</Text>
        <Text style={styles.titlez}>Edit Schedule</Text>

        </View>

        <View style={styles.overall}>
        <TextInput style={styles.input} placeholder='Email' onChangeText={(text) => setEmail(text)} />

            <View>

            <View style={styles.row}>
                <Text style={styles.period}> First Period: </Text>

            </View>

            <View style={styles.row}>
                <TextInput style={styles.input} placeholder='Building' />
                <TextInput style={styles.input} 
                    placeholder='Class Name'
                    autoCorrect={false}
                    onChangeText={(text) => setOne(text)}
                    />
                <TextInput style={styles.input} placeholder='Teacher Last Name' />
                <TextInput style={styles.input} placeholder='Room' />

            </View>

            </View>

            <View>

            <View style={styles.row}>
                <Text style={styles.period}> Second Period: </Text>

            </View>

            <View style={styles.row}>
                <TextInput style={styles.input} placeholder='Building' />
                <TextInput style={styles.input} 
                    placeholder='Class Name'
                    autoCorrect={false}
                    onChangeText={(text) => setTwo(text)}
                    />
                <TextInput style={styles.input} placeholder='Teacher Last Name' />
                <TextInput style={styles.input} placeholder='Room' />

            </View>

            </View>

            <View>

            <View style={styles.row}>
                <Text style={styles.period}> Third Period: </Text>

            </View>

            <View style={styles.row}>
                <TextInput style={styles.input} placeholder='Building' />
                <TextInput style={styles.input} 
                    placeholder='Class Name'
                    autoCorrect={false}
                    onChangeText={(text) => setThree(text)}
                    />
                <TextInput style={styles.input} placeholder='Teacher Last Name' />
                <TextInput style={styles.input} placeholder='Room' />

            </View>

            </View>

            <View>

            <View style={styles.row}>
                <Text style={styles.period}> Fourth Period: </Text>

            </View>

            <View style={styles.row}>
                <TextInput style={styles.input} placeholder='Building' />
                <TextInput style={styles.input} 
                    placeholder='Class Name'
                    autoCorrect={false}
                    onChangeText={(text) => setFour(text)}
                    />
                <TextInput style={styles.input} placeholder='Teacher Last Name' />
                <TextInput style={styles.input} placeholder='Room' />

            </View>

            </View>

            <View>

            <View style={styles.row}>
                <Text style={styles.period}> Fifth Period: </Text>

            </View>

            <View style={styles.row}>
                <TextInput style={styles.input} placeholder='Building' />
                <TextInput style={styles.input} 
                    placeholder='Class Name'
                    autoCorrect={false}
                    onChangeText={(text) => setFive(text)}
                    />
                <TextInput style={styles.input} placeholder='Teacher Last Name' />
                <TextInput style={styles.input} placeholder='Room' />

            </View>

            </View>

            <View>

            <View style={styles.row}>
                <Text style={styles.period}> Sixth Period: </Text>

            </View>

            <View style={styles.row}>
                <TextInput style={styles.input} placeholder='Building' />
                <TextInput style={styles.input} 
                    placeholder='Class Name'
                    autoCorrect={false}
                    onChangeText={(text) => setSix(text)}
                    />
                <TextInput style={styles.input} placeholder='Teacher Last Name' />
                <TextInput style={styles.input} placeholder='Room' />

            </View>

            </View>

            <View>

            <View style={styles.row}>
                <Text style={styles.period}> Seventh Period: </Text>

            </View>

            <View style={styles.row}>
                <TextInput style={styles.input} placeholder='Building' />
                <TextInput style={styles.input} 
                    placeholder='Class Name'
                    autoCorrect={false}
                    onChangeText={(text) => setSeven(text)}
                    />
                <TextInput style={styles.input} placeholder='Teacher Last Name' />
                <TextInput style={styles.input} placeholder='Room' />

            </View>

            </View>

            <View>

            <View style={styles.row}>
                <Text style={styles.period}> Eight Period: </Text>

            </View>

            <View style={styles.row}>
                <TextInput style={styles.input} placeholder='Building' />
                <TextInput style={styles.input} 
                    placeholder='Class Name'
                    autoCorrect={false}
                    onChangeText={(text) => setEight(text)}
                    />
                <TextInput style={styles.input} placeholder='Teacher Last Name' />
                <TextInput style={styles.input} placeholder='Room' />

            </View>

            </View>

        </View>

        <TouchableOpacity 
            style={{backgroundColor: 'green', padding: 5, borderRadius: 15}}
            onPress={() => {handleEdit(one, two, three, four, five, six, seven, eight, email)}}
            >
            <Text> Save Changes </Text>
        </TouchableOpacity>



    
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
        borderRadius: 5,
        padding: 5,
        marginHorizontal: 2,
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
       },
       overall: {
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
       },
       row: {
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 7
       },
       period: {
        fontWeight: "bold",
        alignSelf: 'center',
        fontSize: 15
       }
  });