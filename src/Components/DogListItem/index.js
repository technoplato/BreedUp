import React from "react"
import { View, Image, TouchableHighlight } from "react-native"

import styles from "./DogListItemStyles"
import RoundImageView from "../RoundImageView"

export default class DogListItem extends React.Component {
  render() {
    return <View style={{ marginHorizontal: 6 }}>{this.renderImage()}</View>
  }

  renderImage = () => {
    return (
      <RoundImageView
        onPress={() => this.props.onDogPress(this.props.item)}
        size={this.props.size}
        source={{ uri: this.props.item.imageUri }}
      />
    )
  }
}

DogListItem.defaultProps = {
  size: 48
}
