import React from 'react'
import { View, Text } from 'react-native'

import { styles } from '../styles/light/MapLight'

export default function Map() {
    return (
        <View style={styles.fullScreen}>
            <View style={styles.container}>
                <Text> Map </Text>
            </View>
        </View>
    )
}
