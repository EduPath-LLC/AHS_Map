import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';
import { TextInput, TouchableOpacity, StatusBar, Alert} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather'
const SECTIONS= [
    {
        header: 'Preferences',
        items: [
            {id: 'language', icon: 'globe', label: 'Language', type: 'select'},
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
                                    </View>
                                </TouchableOpacity>
                    </View>
                        ))}
                    </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
        
    )
}
const styles= StyleSheet.create({
    container: {
        paddingVertical: 23,
    },
    header: {
        paddingHorizontal: 23,
        marginBottom: 12,
    }, 
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: 'green',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '500',
        color: 'yellow',
    },
    section: {
        paddingTop: 12,

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
    },
    rowWrapper: {
        paddingLeft: 24,
        borderTopWidth: 1,
        borderColor: 'black',
        backgroundcolor: 'white',
    },
    row: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 24,
    },
    
    
});