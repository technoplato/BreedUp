import React from 'react'
import { View, Text } from 'react-native'

import styles from './SearchStyle'

export default class SearchScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 32 }}>SEARCH SCREEN PLACEHOLDER</Text>
      </View>
    )
  }
}
