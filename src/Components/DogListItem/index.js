import React from "react"
import { View, Image, TouchableHighlight } from "react-native"

import styles from "./DogListItemStyles"

export default class DogListItem extends React.Component {
  render() {
    return <View style={styles.container}>{this.renderImage()}</View>
  }

  renderImage = () => {
    const { imageUri } = this.props.item
    return (
      <TouchableHighlight
        onPress={() => this.props.onDogPress(this.props.item)}
      >
        <Image source={{ uri: imageUri }} style={{ height: 48, width: 48 }} />
      </TouchableHighlight>
    )
  }
}
