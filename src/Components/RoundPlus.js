import React from "react"
import { Text, TouchableWithoutFeedback, View } from "react-native"

const RoundPlus = ({ size, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          height: size,
          width: size,
          borderWidth: 1,
          borderRadius: size / 2,
          borderStyle: "dashed",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text
          style={{
            fontWeight: "100",
            fontSize: size / 2,
            color: "black"
          }}
        >
          +
        </Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

RoundPlus.defaultProps = {
  onPress: () => console.log("onPress RoundPlus"),
  size: 100
}

export default RoundPlus
