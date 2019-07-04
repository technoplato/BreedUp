import React, { Component } from "react"
import { View, Text, Button, Input } from "react-native"
import { eventsRef, currentUser } from "../../Utils/FirebaseUtils"

class ViewEventScreen extends Component {
  state = { loading: true }

  componentDidMount = async () => {
    console.log(this.props.navigation.state.params)
    const event = await getEventById(this.props.navigation.state.params.id)
    this.setState({ event, loading: false })
  }

  render() {
    return this.state.loading ? (
      <Loading />
    ) : (
      <EventDetails event={this.state.event} />
    )
  }
}

const getEventById = async id => {
  return await eventsRef
    .child(id)
    .once("value")
    .then(snap => snap.val())
}

const Loading = () => {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  )
}

const EventDetails = ({ event }) => (
  <View style={{ padding: 12 }}>
    <Text>title: {event.title}</Text>
    <Text>description: {event.description}</Text>
    <Text>address: {event.address}</Text>
    <Text>creator: {event.creator.name}</Text>
    {/* TODO: get distance from event in details page */}
    <Text>distance: {event.distance} km</Text>
  </View>
)

export default ViewEventScreen
