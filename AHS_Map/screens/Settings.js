import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';
import { TextInput, TouchableOpacity, StatusBar, Alert, Switch} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather'
const SECTIONS= [
    {
        header: 'Preferences',
        items: [
            {id: 'language', icon: 'globe', label: 'Language', type: 'link'},
            { id: 'darkmode', icon: 'moon', label: 'Dark Mode', type: 'toggle'},
            { id: 'wifi', icon: 'wifi', label : 'Use Wi-Fi', type: 'toggle'},
        ]
    },
    {
        header:'Help',
        items: [
            { id:'bug', icon: 'flag', label: 'Report Bug', type:'link'},
        { id: 'contact', icon: 'mail', label : 'Contact Us', type: 'link'},
        ]
    },
    {
        header: 'Content', 
        items: [
            { id: 'save', icon: 'save', label: 'Saved', type: 'link'},
            {id: 'download', icon: 'download', label: 'Downloads', type: 'link'},
        ],
    },
];

export default function Settings(navigation) {
    const [form, setForm] = useState({
        language: 'English',
        darkMode: true,
        wifi: false,
    })

    return (
        <SafeAreaView style={{ flex:1, backgroundColor: 'white'}}>
            <StatusBar
         barStyle = "dark-content" 
         backgroundColor = "#3091BE" 
         translucent = {true}
      />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>

                <Text style={styles.title}>Settings</Text>
                <Text style={styles.subtitle}>Update your preferences here</Text>
                </View>

                {SECTIONS.map(({ header, items})=> (
                    <View style={styles.section} key={header}>
                    <View styles={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>{header}</Text>
                    </View>
                    <View style={styles.sectionBody}>
                        {items.map(({ label, id, type, icon}, index) => (
                            <View
                            style={[
                                styles.rowWrapper,
                                index === 0 && {borderTopWidth: 0 },
                            ]}
                            key={id}>
                                <TouchableOpacity
                                onPress={() => {}}>
                                    <View style={styles.row}>
                                        <FeatherIcon
                                        name={icon}
                                        color="blue"
                                        size={22}
                                        style={{marginRight:12}}
                                         />
                                        <Text style={styles.rowLabel}>{label}</Text>

                                        <View style={styles.rowSpacer} />
                                        {type === 'select' &&(
                                            <Text style = {styles.rowValue}>{form[id]}</Text>
                                        )}
                                        
                                        {type === 'toggle' && <Switch value={form[id]} onValueChange={(value) => setForm({...form, [id]:value})}/>}
                                    </View>
                                </TouchableOpacity>
                    </View>
                        ))}
                    </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
        
    )}

const styles= StyleSheet.create({
    container: {
        paddingVertical: 23,
    },
    header: {
        paddingHorizontal: 24,
        marginBottom: 12,
        
    }, 
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: 'black',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '500',
        color: 'gray',
    },
    section: {
        paddingTop: 12,
        left: 0,

    },
    sectionHeader: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        
    },
    sectionHeaderText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'blue',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginHorizontal:12,
    },
    rowWrapper: {
        paddingLeft: 24,
        //borderTopWidth: 1,
        borderColor: 'black',
        backgroundcolor: 'white',
    },
    row: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor:  '#f2f2f2',
        marginBottom: 12,
        borderRadius: 8,
        paddingRight: 24,
        marginRight: 24,
        paddingHorizontal: 12,
    },
    rowLabel : {
        fontSize: 17,
        fontWeight: '500',
        color: '#000'
    },
    rowSpacer: {
        flex: 1,
    },
    rowValue: {
        fontSize: 17,
        fontWeight: '500',
        color: '#616161',
        marginRight: 4,

    }
    
});