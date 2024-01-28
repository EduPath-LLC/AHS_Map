import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Switch } from 'react-native';
import { TextInput, TouchableOpacity, StatusBar, Alert} from 'react-native';
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
    const [form, setForm] = React.useState ({
        darkMode: true,
        wifi: false,
    });
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
                                        <View style={{ flex: 1,}}></View>
                                        {type === 'toggle' && <Switch 
                                         value={form[id]}
                                         onValueChange={value => setForm({ ...form, [id]: value })}
                                        />}

                                        {type === 'link' && ( 
                                            <FeatherIcon name ="chevron-right" color="0c0c0c" size={22}/>
                                        )}
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
        color: 'blue',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '500',
        color: 'slategray',
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
        left: 10,
        marginBottom: 12,
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
    
    
});