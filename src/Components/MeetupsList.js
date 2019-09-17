import React, { Component } from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native'
import GeoFire from 'geofire'

import { eventsRef } from '../Utils/FirebaseUtils'
import { getCoordinatesForAddress } from '../Utils/location'

class MeetupsList extends Component {
  state = { meetups: [] }

  componentDidMount = async () => {}

  render() {
    return (
      <View>
        <Text>Listing Events Below</Text>
        {this.state.meetups.map(event => {
          return (
            <EventListItem
              key={event.key}
              event={event}
              onEventPress={this.handleEventPress}
            />
          )
        })}
      </View>
    )
  }

  handleEventPress = event => {
    console.log(this.props)
    this.props.navigation.navigate('ViewMeetup', {
      id: event.key
    })
  }
}

const EventListItem = ({ event, onEventPress }) => (
  <TouchableWithoutFeedback onPress={() => onEventPress(event)}>
    <View style={{ padding: 12 }}>
      <Text>title: {event.title}</Text>
      <Text>description: {event.description}</Text>
      <Text>address: {event.address}</Text>
      <Text>creator: {event.creator.name}</Text>
      <Text>distance: {event.distance} km</Text>
    </View>
  </TouchableWithoutFeedback>
)

export default MeetupsList
