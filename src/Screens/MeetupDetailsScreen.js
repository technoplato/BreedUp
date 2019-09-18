import React, { Component } from 'react'
import { View, Text, Button, Input } from 'react-native'
import { eventsRef } from '../Utils/FirebaseUtils'

class MeetupDetailsScreen extends Component {
  state = { loading: true }

  componentDidMount = async () => {
    console.log(this.props.navigation.state.params)
    const event = await getMeetupById(this.props.navigation.state.params.id)
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
    <Text>photo: {event.creator.image}</Text>
  </View>
)

export default MeetupDetailsScreen
