import React, { Component } from 'react'
import { View } from 'react-native'
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
import { SafeAreaView } from 'react-navigation'
import { Button, Input } from 'react-native-elements'
import firestore from '@react-native-firebase/firestore'

const InviteUserButton = ({ recipient, handlePress }) => {
  console.log(recipient)
  const text = recipient
    ? `Inviting: ${recipient.username} (click to change)`
    : 'Click to search for a User.'
  return (
    <Button
      containerStyle={{ marginTop: 12 }}
      title={text}
      onPress={handlePress}
    />
  )
}

const PickLocationButton = ({ location, handlePress }) => {
  const text = location ? location.name : 'Click to search for a Location.'
  return (
    <Button
      containerStyle={{ marginTop: 12 }}
      title={text}
      onPress={handlePress}
    />
  )
}

export default class CreateMeetupScreen extends Component {
  state = {
    title: '',
    description: '',
    location: null,
    recipient: null
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareView
          style={{
            flex: 1,
            padding: 10
          }}
        >
          <Input
            onChangeText={title => this.setState({ title })}
            label={'Title'}
            placeholder={'Your awesome new Meetup!'}
          />

          <Input
            containerStyle={{ marginTop: 12 }}
            onChangeText={description => this.setState({ description })}
            label={'Description'}
            placeholder={'Include some brief details about the Meetup'}
          />

          <InviteUserButton
            recipient={this.state.recipient}
            handlePress={() =>
              this.props.navigation.navigate('SearchUser', {
                onUserChosen: recipient => {
                  this.setState({ recipient })
                }
              })
            }
          />

          <PickLocationButton
            location={this.state.location}
            handlePress={() =>
              this.props.navigation.navigate('SearchAddress', {
                onLocationChosen: location => {
                  this.setState({ location })
                }
              })
            }
          />

          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              flexDirection: 'column'
            }}
          >
            <Button title="Create Meetup!" onPress={this.addEvent} />
          </View>
        </KeyboardAwareView>
      </SafeAreaView>
    )
  }

  addEvent = async () => {
    const { title, description, location, recipient } = this.state
    console.log(this.state)
    const event = { title, description, location, recipient }
    const saved = await saveMeetup(event)
    this.props.navigation.state.params.onEventAdded(saved)
    this.props.navigation.goBack()
  }
}

const saveMeetup = async info => {
  const { displayName, uid, photoURL } = global.user
  const meetupDoc = firestore()
    .collection('meetups')
    .doc()
  const sender = {
    name: displayName,
    uid,
    image: photoURL
  }

  const meetup = {
    id: meetupDoc.id,
    ...info,
    sender,
    participantsIds: [uid, info.recipient.uid],
    participants: [sender, info.recipient],
    created: Date.now(),
    accepted: false
  }

  console.log(meetup)

  await meetupDoc.set(meetup)

  return meetup
}
