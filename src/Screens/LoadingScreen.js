import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

import styles from './LoadingStyles'

export default () => {
  return (
    <View style={styles.container}>
      <Text>Loading</Text>
      <ActivityIndicator size="large" />
    </View>
  )
}
