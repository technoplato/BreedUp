import React from 'react'
import PropTypes from 'prop-types'
import { Image } from 'react-native'

export default class RoundImageView extends React.Component {
  static propTypes = {
    size: PropTypes.number.isRequired,
    source: PropTypes.objectOf(PropTypes.string).isRequired
  }

  render() {
    const { size, source } = this.props
    return (
      <Image
        source={source}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    )
  }
}
