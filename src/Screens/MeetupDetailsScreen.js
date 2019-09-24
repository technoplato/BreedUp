import React, { useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Platform,
  TouchableWithoutFeedback
} from 'react-native'
import { Button, Avatar } from 'react-native-elements'
import _ from 'lodash'

import Loading from 'components/LargeLoadingIndicator'
import useMeetup from 'hooks/useMeetup'
import formatDate from 'utilities/format-date'

import declineInvite from 'utilities/decline-invite'
import acceptInvite from 'utilities/accept-invite'

const MeetupDetailsScreen = ({
  /* Fancy destructuring. Do you love it? Hate it? I'm not sure yet... */
  navigation: {
    state: { params },
    setParams,
    navigate
  }
}) => {
  const { meetup, loading, error } = useMeetup(params.id)
  const id = _.get(meetup, 'id', '')

  useEffect(() => {
    setParams({ title: id === '' ? 'Loading' : meetup.title.toString() })
  }, [id])

  if (loading) {
    return <Loading />
  } else {
    return <MeetupDetails meetup={meetup} navigate={navigate} />
  }
}

const MeetupButtons = ({ meetup }) => {
  const { sender, recipient, accepted, declined } = meetup

  const me = global.user.uid
  const recipientId = recipient.uid
  const senderId = sender.uid
  const pending = !accepted && !declined

  const showAccept = me === recipientId && pending
  const showDecline = me === recipientId && pending

  return (
    <View>
      {showAccept && (
        <Button onPress={() => acceptInvite(meetup)} title="Accept" />
      )}
      {showDecline && (
        <Button onPress={() => declineInvite(meetup)} title="Decline" />
      )}
    </View>
  )
}

const Details = ({ title, info, onPress, clickable }) => {
  if (!!!info) return null
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        onPress && onPress()
      }}
    >
      <View>
        <Text style={styles.label}>{title}</Text>
        <Text style={[styles.info, clickable && styles.clickable]}>{info}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

const openMap = meetup => {
  const uri = Platform.select({
    ios: meetup.location.uri.ios,
    android: meetup.location.uri.android
  })
  Linking.openURL(uri)
}

const MeetupDetails = ({ meetup, navigate }) => (
  <View style={{ padding: 24 }}>
    <ScrollView>
      {meetup.declined && (
        <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 20 }}>
          (DECLINED)
        </Text>
      )}
      <Avatar
        size="xlarge"
        rounded
        containerStyle={{ marginBottom: 12, alignSelf: 'center' }}
        source={{
          uri: meetup.sender.photo
        }}
      />
      <Details title={'Description'} info={meetup.description} />
      <Details
        clickable
        onPress={() => openMap(meetup)}
        title={'Location Name'}
        info={meetup.location.name}
      />
      <Details
        clickable
        onPress={() => openMap(meetup)}
        title={'Address'}
        info={meetup.location.address}
      />
      <Details title={'Date'} info={formatDate(meetup.date)} />
      <Text style={styles.label}>Participants</Text>
      {meetup.participants.map(participant => (
        <Text
          onPress={() => {
            navigate('ViewUser', {
              userId: participant.uid
            })
          }}
          key={participant.uid}
          style={[styles.info, styles.clickable]}
        >
          {participant.name}
        </Text>
      ))}
      <MeetupButtons meetup={meetup} />
    </ScrollView>
  </View>
)

const styles = StyleSheet.create({
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 6
  },
  clickable: {
    color: 'blue',
    textDecorationLine: 'underline'
  },
  info: { fontSize: 18, marginBottom: 8 }
})

export default MeetupDetailsScreen
