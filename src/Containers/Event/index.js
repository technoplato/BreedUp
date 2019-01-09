import React, { Component } from 'react'
import { View, Text, Button } from 'react-native'

import { getCoordinatesForAddress } from '../../Utils/location'

class EventScreen extends Component {
  state = { stuff: null }

  componentDidMount = async () => {
    const coordinates = await getCoordinatesForAddress(
      '1600 Amphitheater Drive, Mountain View CA'
    )
    this.setState({ stuff: JSON.stringify(coordinates) })
  }

  render() {
    return (
      <View>
        <Text>Stuff: {this.state.stuff}</Text>
        <Button
          title="Add Event"
          onPress={() =>
            this.props.navigation.navigate('AddEvent', {
              onEventAdded: event => this.handleEventAdded(event)
            })
          }
        />
        <Button
          title="List Events"
          onPress={() => this.props.navigation.navigate('ListEvents')}
        />
      </View>
    )
  }

  handleEventAdded = event => {
    console.log(event)
  }
}

export default EventScreen
