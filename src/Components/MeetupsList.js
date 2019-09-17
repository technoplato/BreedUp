import React, { Component } from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native'
import GeoFire from 'geofire'

import { eventsRef } from '../Utils/FirebaseUtils'
import { getCoordinatesForAddress } from '../Utils/location'

class MeetupsList extends Component {
  state = { events: [] }

  componentDidMount = async () => {
    const coordinates = await getCoordinatesForAddress(
      '5368 Carrara Court, Saint Cloud Florida 34771'
    )

    // const events = await getAllEventsByProximity(
    //   coordinates,
    //   5, //km
    //   eventsRef
    // )
    //
    // console.log(events)
    //
    // this.setState({ events: events })
  }

  render() {
    return (
      <View>
        <Text>Listing Events Below</Text>
        {this.state.events.map(event => {
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

// const getAllEventsByProximity = async (center, radiusKm, eventsRef) => {
//   const geofire = new GeoFire(eventsRef)
//
//   const query = geofire.query({
//     center,
//     radius: radiusKm // km
//   })
//
//   const events = []
//
//   query.on('key_entered', (key, location, distance) => {
//     events.push({
//       key,
//       location,
//       distance
//     })
//   })
//
//   await new Promise(resolve => {
//     query.on('ready', () => {
//       resolve()
//     })
//   })
//
//   const eventPromises = []
//   events.forEach(event => {
//     eventPromises.push(
//       eventsRef
//         .child(event.key)
//         .once('value')
//         .then(snap => snap.val())
//         .then(fetchedEvent => {
//           return {
//             ...fetchedEvent,
//             ...event
//           }
//         })
//     )
//   })
//
//   return await Promise.all(eventPromises)
// }

export default MeetupsList
