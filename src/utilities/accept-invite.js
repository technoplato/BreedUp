import firestore from '@react-native-firebase/firestore'

export default async invite => {
  if (invite.recipient.uid === global.user.uid) {
    try {
      await firestore()
        .collection('meetups')
        .doc(invite.id)
        .update({ accepted: true })

      return { ...invite, accepted: true }
    } catch (err) {
      throw err
    }
  } else {
    throw Error("Cannot accept an invite that wasn't sent to you.")
  }
}
