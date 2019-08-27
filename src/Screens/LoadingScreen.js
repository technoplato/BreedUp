import React from "react"
import { View, Text, ActivityIndicator } from "react-native"

import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import '@react-native-firebase/firestore';
import '@react-native-firebase/auth';

import styles from "./LoadingStyles"
import { updateUserLocation } from "../Interactors/Location"

export default class Loading extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        updateUserLocation(user.uid)
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
