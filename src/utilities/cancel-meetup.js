import firestore from '@react-native-firebase/firestore'

export default async invite => {
  if (invite.accepted) {
    if (invite.participantIds.includes(global.user.uid)) {
      try {
        await firestore()
          .collection('meetups')
          .doc(invite.id)
          .update({ cancelled: true })
        return { ...invite, cancelled: true }
      } catch (err) {
        throw err
      }
    } else {
      throw Error("Cannot cancel a Meetup that you aren't a participant in.")
    }
  } else {
    throw Error("Cannot cancel a Meetup that hasn't been accepted yet.")
  }
}
