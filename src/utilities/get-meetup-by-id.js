export default async id => {
  return await firestore()
    .collection('meetups')
    .doc(id)
    .get()
    .then(doc => doc.data())
}
