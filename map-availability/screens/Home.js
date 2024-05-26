import React from 'react'
import { View, Text } from 'react-native'

import { styles } from '../styles/light/HomeLight'

export default function Home() {
    return (
        <View style={styles.fullScreen}>
            <View style={styles.container}>
                <Text> Home </Text>
            </View>
        </View>
    )
}
