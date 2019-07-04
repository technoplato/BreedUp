import React, { Component } from "react"
import { View } from "react-native"
import { Button } from "react-native-elements"

import EventsList from "../../Components/EventsList"

class EventScreen extends Component {
  render() {
    return (
      <View>
        <Button
          title="Add Event"
          buttonStyle={{
            backgroundColor: "black"
          }}
          onPress={() =>
            this.props.navigation.navigate("AddEvent", {
              onEventAdded: event => this.handleEventAdded(event)
            })
          }
        />
        <EventsList navigation={this.props.navigation} />
      </View>
    )
  }

  handleEventAdded = event => {
    console.log(event)
  }
}

export default EventScreen
