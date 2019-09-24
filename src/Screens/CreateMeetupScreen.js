import React, { Component } from 'react'
import { View } from 'react-native'
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
import { SafeAreaView } from 'react-navigation'
import { Button, Input, Text } from 'react-native-elements'
import firestore from '@react-native-firebase/firestore'
import formatUtcToLocalDate from 'utilities/format-date'

const InviteUserButton = ({ recipient, handlePress }) => {
  const text = recipient
    ? `Inviting: ${recipient.name} (click to change)`
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

const PickDateButton = ({ date: utcDate, handlePress }) => {
  const text = utcDate ? formatUtcToLocalDate(utcDate) : 'Click to pick a Time.'
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
    recipient: null,
    error: null
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
                  this.setState({ recipient, error: null })
                }
              })
            }
          />

          <PickLocationButton
            location={this.state.location}
            handlePress={() =>
              this.props.navigation.navigate('SearchAddress', {
                onLocationChosen: location => {
                  this.setState({ location, error: null })
                }
              })
            }
          />

          <PickDateButton
            date={this.state.date}
            handlePress={() =>
              this.props.navigation.navigate('PickTime', {
                onDateChosen: date => {
                  this.setState({ date, error: null })
                }
              })
            }
          />

          {this.state.error && (
            <View
              style={{
                paddingTop: 12,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text style={{ color: 'red', fontSize: 22 }} h4>
                {this.state.error}
              </Text>
            </View>
          )}

          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              flexDirection: 'column',
              paddingBottom: 32
            }}
          >
            <Button title="Create Meetup!" onPress={this.addEvent} />
          </View>
        </KeyboardAwareView>
      </SafeAreaView>
    )
  }

  checkErrors = () => {
    const { title, description, location, recipient, date } = this.state
    const state = { title, description, location, recipient, date }
    Object.entries(state).forEach(([key, value]) => {
      if (!value) {
        this.setState({
          error: `Please enter a ${key.charAt(0).toUpperCase() + key.slice(1)}`
        })
        return false
      }
    })

    return true
  }

  addEvent = async () => {
    if (this.checkErrors()) {
      const { title, description, location, recipient, date } = this.state
      const event = { title, description, location, recipient, date }
      await saveMeetup(event)
      this.props.navigation.goBack()
    }
  }
}

const saveMeetup = async info => {
  const { username, uid, photo } = global.user
  const meetupDoc = firestore()
    .collection('meetups')
    .doc()
  const sender = {
    name: username,
    uid,
    photo: photo
  }

  const meetup = {
    id: meetupDoc.id,
    ...info,
    sender,
    participantIds: [uid, info.recipient.uid],
    participants: [sender, info.recipient],
    created: Date.now(),
    accepted: false
  }

  await meetupDoc.set(meetup)

  return meetup
}
