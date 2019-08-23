import React from "react"
import PropTypes from "prop-types"
import { Image, TouchableWithoutFeedback } from "react-native"

export default class RoundImageView extends React.Component {
  static propTypes = {
    size: PropTypes.number.isRequired,
    source: PropTypes.objectOf(PropTypes.string).isRequired,
    onPress: PropTypes.func
  }

  render() {
    const { size, source } = this.props
    let image = (
      <Image
        source={source}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    )

    const { onPress } = this.props
    if (onPress) {
      image = (
        <TouchableWithoutFeedback
          style={{ ...this.props.style }}
          onPress={onPress}
        >
          {image}
        </TouchableWithoutFeedback>
      )
    }
    return image
  }
}
