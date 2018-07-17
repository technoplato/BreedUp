import React from 'react'
import { Button, View, Text } from 'react-native'
import firebase from 'react-native-firebase'

import styles from './FeedScreenStyles'

export default class Main extends React.Component {
  state = { currentUser: null }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
  }

  handleLogout() {
    firebase.auth().signOut()
  }

  render() {
    const { currentUser } = this.state

    console.log(currentUser)

    return (
      <View style={styles.container}>
        <Text>Hi {currentUser && currentUser.displayName}!</Text>
        <Button title="Log Out" onPress={this.handleLogout} />
      </View>
    )
  }
}
