import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ActivityIndicator
} from 'react-native'
import { Button } from 'react-native-elements'
import firebase from 'react-native-firebase'
import Modal from 'react-native-modal'
import _ from 'lodash'

import RoundImage from '../../Components/RoundImageView'
import { Colors } from '../../Themes'

export default class Fiddling extends React.Component {
  render() {
    return (
      <View style={styles.screen.container}>
        <Text style={styles.screen.text}>
          This screen is for testing layouts and stuff.
        </Text>
      </View>
    )
  }
}

const styles = {
  screen: StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'blue',
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
      fontSize: 24
    }
  })
}
