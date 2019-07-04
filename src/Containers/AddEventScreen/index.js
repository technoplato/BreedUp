import React, { Component } from "react"
import { View, Text, Button, TextInput } from "react-native"
import { eventsRef, currentUser } from "../../Utils/FirebaseUtils"
import GeoFire from "geofire"

import { getCoordinatesForAddress } from "../../Utils/location"

class AddEventScreen extends Component {
  state = {
    title: "",
    description: "",
    address: "5368 Carrara Court, Saint Cloud Florida 34771"
  }

  render() {
    return (
      <View>
        <Button title="Add Event" onPress={this.addEvent} />
        {this.state.error && <Text>Error: {this.state.error}</Text>}
        <TextInput
          placeholder="Enter a title"
          onChangeText={title => this.setState({ title })}
          value={this.state.title}
        />

        <TextInput
          placeholder="Enter a description"
          onChangeText={description => this.setState({ description })}
          value={this.state.description}
        />

        <TextInput
          placeholder="Enter a address"
          onChangeText={address => this.setState({ address })}
          value={"5368 Carrara Court, Saint Cloud Florida 34771"}
        />
      </View>
    )
  }

  addEvent = async () => {
    const { title, description, address } = this.state
    const event = { title, description, address }
    const saved = await saveEvent(event)
    if (!saved) {
      this.setState({
        error: "Could not find that address, please try again."
      })
      return
    }
    this.setState({ title: "", description: "", address: "" })
    this.props.navigation.state.params.onEventAdded(saved)
    this.props.navigation.goBack()
  }
}

const saveEvent = async event => {
  const coordinates = await getCoordinatesForAddress(event.address)
  if (!coordinates) {
    return null
  }
  const { displayName, uid, photoURL } = currentUser()
  const ref = eventsRef.push()
  const dto = {
    id: ref.key,
    ...event,
    coordinates,
    creator: {
      name: displayName,
      uid,
      image: photoURL
    },
    attendees: {},
    createdOn: Date.now()
  }

  const georef = eventsRef
  const geofire = new GeoFire(georef)

  await geofire.set(dto.id, dto.coordinates)
  await ref.update(dto)

  return dto
}

export default AddEventScreen
