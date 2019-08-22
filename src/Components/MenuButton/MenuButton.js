import React from "react"
import { Image, Text, TouchableHighlight, View } from "react-native"
import styles from "./styles"

export default class MenuButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        style={styles.btnClickContain}
        underlayColor="rgba(128, 128, 128, 0.1)"
      >
        <View style={styles.btnContainer}>
          <Image source={this.props.source} style={styles.btnIcon} />
          <Text style={styles.btnText}>{this.props.title}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}
