import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

import firebase from 'react-native-firebase'

import styles from './LoadingStyles'

export default class Loading extends React.Component {
  componentDidMount() {
    this.authStateUnsubscribe = firebase.auth().onAuthStateChanged(user => {
      console.log('Loading: onAuthStateChanged')
      this.props.navigation.navigate(user ? 'Main' : 'SignUp')
    })
  }

  componentWillUnmount() {
    // TODO - when should the listener for auth be removed? Should it be added to App?
    console.log('componentWillUnmount')
    this.authStateUnsubscribe()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }
}
