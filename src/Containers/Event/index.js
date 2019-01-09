import React, { Component } from 'react'
import { View, Text, Button } from 'react-native'

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
        <Button
          title="Add Event"
          onPress={() => this.props.navigation.navigate('AddEvent')}
        />
        <Button
          title="List Events"
          onPress={() => this.props.navigation.navigate('ListEvents')}
        />
      </View>
    )
  }
}

export default EventScreen
