import firestore from '@react-native-firebase/firestore'

export default async ({ id, recipient, accepted, declined }) => {
  if (!accepted && !declined) {
    if (recipient.uid === global.user.uid) {
      try {
        await firestore()
          .collection('meetups')
          .doc(id)
          .update({ accepted: true })
        return { accepted: true }
      } catch (err) {
        throw err
      }
    } else {
      throw Error("Cannot accept an Invite that wasn't sent to you.")
    }
  } else {
    throw Error(
      'Cannot accept an Invite that has already been accepted or declined.'
    )
  }
}
