import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { Button } from 'react-native-elements'
import _ from 'lodash'

import Loading from 'components/LargeLoadingIndicator'
import useMeetup from 'hooks/useMeetup'
import formatDate from 'utilities/format-date'

import cancelInvite from 'utilities/cancel-invite'
import declineInvite from 'utilities/decline-invite'
import acceptInvite from 'utilities/accept-invite'
import cancelMeetup from 'utilities/cancel-meetup'

const MeetupDetailsScreen = ({
  /* Fancy destructuring. Do you love it? Hate it? I'm not sure yet... */
  navigation: {
    state: { params },
    setParams
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
    return <MeetupDetails meetup={meetup} />
  }
}

const MeetupButtons = ({ meetup }) => {
  const {
    sender,
    recipient,
    accepted,
    declined,
    participantIds,
    cancelled
  } = meetup

  const me = global.user.uid
  const recipientId = recipient.uid
  const senderId = sender.uid
  const pending = !accepted && !declined && !cancelled

  const showAccept = me === recipientId && pending
  const showDecline = me === recipientId && pending
  const showCancelMeetup = participantIds.includes(me) && !pending
  const showCancelInvite = senderId === me && pending

  console.log({ participantIds })
  console.log({ showCancelInvite })
  console.log({ showCancelMeetup })
  console.log({ me })
  console.log({ pending })

  return (
    <View>
      {showAccept && (
        <Button onPress={() => acceptInvite(meetup)} title="Accept" />
      )}
      {showDecline && (
        <Button onPress={() => declineInvite(meetup)} title="Decline" />
      )}
      {showCancelMeetup && (
        <Button onPress={() => cancelMeetup(meetup)} title="Cancel Meetup" />
      )}
      {showCancelInvite && (
        <Button onPress={() => cancelInvite(meetup)} title="Cancel Invite" />
      )}
    </View>
  )
}

const MeetupDetails = ({ meetup }) => (
  <View style={{ padding: 12 }}>
    <Text>description: {meetup.description}</Text>
    <Text>address: {meetup.location.address}</Text>
    <Text>location name: {meetup.location.name}</Text>
    <Text>creator: {meetup.sender.name}</Text>
    <Text>date: {formatDate(meetup.date)}</Text>
    <Text>photo: {meetup.sender.photo}</Text>
    <MeetupButtons meetup={meetup} />
  </View>
)

export default MeetupDetailsScreen
