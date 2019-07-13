import React from "react"
import { View, StyleSheet, Text } from "react-native"

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
      backgroundColor: "blue",
      alignItems: "center",
      justifyContent: "center"
    },
    text: {
      fontSize: 24
    }
  })
}
