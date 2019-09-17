import firestore from '@react-native-firebase/firestore'

export default async invite => {
  try {
    await firestore()
      .collection('meetups')
      .doc(invite.id)
      .delete()
    return invite
  } catch (err) {
    throw err
  }
}
