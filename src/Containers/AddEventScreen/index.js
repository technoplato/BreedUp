import React, { Component } from 'react'
import { View, Text, Button, Input } from 'react-native'
import { eventsRef, currentUser } from '../../Utils/FirebaseUtils'

import { getCoordinatesForAddress } from '../../Utils/location'

class EventScreen extends Component {
  state = {
    title: 'Title',
    description: 'Description',
    address: '1600 Amphitheater Drive, Mountain View CA'
  }

  render() {
    console.log('render')
    return (
      <View>
        <Button title="Add Event" onPress={this.addEvent} />
      </View>
    )
  }

  addEvent = async () => {
    const { title, description, address } = this.state
    const event = { title, description, address }
    const saved = await saveEvent(event)
    this.props.navigation.state.params.onEventAdded(saved)
  }
}

const saveEvent = async event => {
  const coordinates = await getCoordinatesForAddress(event.address)
  const { displayName, uid } = currentUser()
  const ref = eventsRef.push()
  const dto = {
    id: ref.key,
    ...event,
    coordinates,
    creator: {
      name: displayName,
      uid
    },
    attendees: {},
    createdOn: Date.now()
  }
  await ref.set(dto)
  return dto
}

export default EventScreen
