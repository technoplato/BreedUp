import React from "react"
import { View, Text, ActivityIndicator } from "react-native"

import firebase from "react-native-firebase"

import styles from "./LoadingStyles"

export default class Loading extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.navigate("Feed")
      } else {
        this.props.navigation.navigate("SignUp")
      }
    })
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
