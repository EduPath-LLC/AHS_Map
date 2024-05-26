import React from 'react'
import { View, Text } from 'react-native'

import { styles } from '../styles/light/SettingsLight'

export default function Settings() {
    return (
        <View style={styles.fullScreen}>
            <View style={styles.container}>
                <Text> Settings </Text>
            </View>
        </View>
    )
}
