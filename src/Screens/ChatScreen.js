import React from "react"
import { View, Text } from "react-native"

export default class ChatScreen extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "yellow",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text>CHAT SCREEN</Text>
      </View>
    )
  }
}
