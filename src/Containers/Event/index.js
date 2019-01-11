import React, { Component } from 'react'
import { View, Button } from 'react-native'

class EventScreen extends Component {
  render() {
    return (
      <View>
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
