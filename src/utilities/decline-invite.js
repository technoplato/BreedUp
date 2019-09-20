import firestore from '@react-native-firebase/firestore'

export default async ({ id, recipient, accepted, declined }) => {
  if (!accepted && !declined) {
    if (recipient.uid === global.user.uid) {
      try {
        await firestore()
          .collection('meetups')
          .doc(id)
          .update({ declined: true })
        return { declined: true }
      } catch (err) {
        throw err
      }
    } else {
      throw Error("Cannot decline an Invite that wasn't sent to you.")
    }
  } else {
    throw Error(
      'Cannot decline an Invite that has already been accepted or declined.'
    )
  }
}
