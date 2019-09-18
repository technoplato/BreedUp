import firestore from '@react-native-firebase/firestore'

export default async invite => {
  if (invite.sender.uid === global.user.uid) {
    try {
      await firestore()
        .collection('meetups')
        .doc(invite.id)
        .delete()
      return invite
    } catch (err) {
      throw err
    }
  } else {
    throw Error("Cannot delete an invite you didn't create.")
  }
}
