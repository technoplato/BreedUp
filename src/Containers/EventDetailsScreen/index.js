import React, { Component } from "react"
import { View } from "react-native"
import { Button } from "react-native-elements"

import EventsList from "../../Components/EventsList"

class EventScreen extends Component {
  render() {
    return (
      <View>
        <Button
          title="PO Event"
          onPress={() =>
            this.props.navigation.navigate("AddEvent", {
              onEventAdded: event => this.handleEventAdded(event)
            })
          }
        />
        <EventsList />
      </View>
    )
  }

  handleEventAdded = event => {
    console.log(event)
  }
}

export default EventScreen
