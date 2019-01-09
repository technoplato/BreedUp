import React, { Component } from 'react'
import { View, Text } from 'react-native'

import { getCoordinatesForAddress } from '../../Utils/location'

class EventScreen extends Component {
  state = { stuff: null }

  componentDidMount = async () => {
    const coordinates = await getCoordinatesForAddress(
      '12221 East Colonial Drive'
    )
    this.setState({ stuff: JSON.stringify(coordinates) })
  }

  render() {
    return (
      <View>
        <Text>Stuff: {this.state.stuff}</Text>
      </View>
    )
  }
}

export default EventScreen
