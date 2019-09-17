import { useState } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import firestore from '@react-native-firebase/firestore'

export default uid => {
  const [values, loading, error] = useCollectionData(
    firestore()
      .collection('meetups')
      .where('participantIds', 'array-contains', uid)
  )

  const invites = {
    upcoming: {},
    received: {},
    sent: {}
  }

  values &&
    values.forEach(meetup => {
      if (meetup.accepted) {
        invites.upcoming[meetup.id] = meetup
      } else if (meetup.recipient.uid === uid) {
        invites.received[meetup.id] = meetup
      } else if (meetup.sender.uid === uid) {
        invites.sent[meetup.id] = meetup
      }
    })

  return { invites, values, loading, error }
}
