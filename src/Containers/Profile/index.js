import React from 'react'
import { View, Text } from 'react-native'
import { Icon } from 'react-native-elements'

import styles from './ProfileScreenStyles'

export default class ProfileScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Profile Placeholder</Text>
      </View>
    )
  }
}
