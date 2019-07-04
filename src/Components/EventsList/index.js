import React, { Component } from "react"
import { View, Text, TouchableWithoutFeedback } from "react-native"
import GeoFire from "geofire"

import { eventsRef, currentUser } from "../../Utils/FirebaseUtils"
import { getCoordinatesForAddress } from "../../Utils/location"

class EventsList extends Component {
  state = { events: [] }

  componentDidMount = async () => {
    const coordinates = await getCoordinatesForAddress(
      "12221 East Colonial Drive"
    )

    const events = await getAllEventsByProximity(
      coordinates,
      5, //km
      eventsRef
    )

    this.setState({ events: events })
  }

  render() {
    return (
      <View>
        <Text>List Events</Text>
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
    this.props.navigation.navigate("ViewEvent", {
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

const getAllEventsByProximity = async (center, radiusKm, eventsRef) => {
  const geofire = new GeoFire(eventsRef)

  const query = geofire.query({
    center,
    radius: radiusKm // km
  })

  const events = []

  query.on("key_entered", (key, location, distance) => {
    events.push({
      key,
      location,
      distance
    })
  })

  await new Promise(resolve => {
    query.on("ready", () => {
      resolve()
    })
  })

  const eventPromises = []
  events.forEach((event, index) => {
    eventPromises.push(
      eventsRef
        .child(event.key)
        .once("value")
        .then(snap => snap.val())
        .then(fetchedEvent => {
          return {
            ...fetchedEvent,
            ...event
          }
        })
    )
  })

  const fetchedEvents = await Promise.all(eventPromises)

  return fetchedEvents
}

export default EventsList
