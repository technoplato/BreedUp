import firebase from '@react-native-firebase/app'
import '@react-native-firebase/database'
import '@react-native-firebase/firestore'
import '@react-native-firebase/auth'

import { uploadImage, deleteImage } from '../../Utils/FirebaseUtils'

export const addDog = async (ownerId, name, breed, imageUri) => {
  const userRef = firebase
    .firestore()
    .collection('users')
    .doc(ownerId)
  const { uid, username, photoURL, description } = await userRef
    .get()
    .then(doc => doc.data())
  const owner = { uid, username, photoURL, description }
  const newDogRef = firebase
    .firestore()
    .collection('dogs')
    .doc()
  const newImageUri = await uploadImage(
    imageUri,
    ownerId,
    'dogs/' + newDogRef.id
  )

  const newDog = {
    name: name,
    lowercaseName: name.toLocaleLowerCase(),
    imageUri: newImageUri,
    breed: breed,
    id: newDogRef.id,
    owner
  }

  await newDogRef.set(newDog)

  return Promise.resolve(newDog)
}

export const updateDog = async (oldDog, newDog) => {
  if (oldDog.imageUri !== newDog.imageUri) {
    const newImageUri = await updateDogImage(newDog)
    newDog.imageUri = newImageUri
  }

  newdDog.lowercaseName = newDog.name.toLocaleLowerCase()

  return firestore()
    .collection('dogs')
    .doc(newDog.id)
    .set(newDog)
}
export const fetchDogsForUser = async ownerId => {
  return await firebase
    .firestore()
    .collection('users')
    .doc(ownerId)
    .get()
    .then(doc => {
      console.log(doc.data())
      return doc.data().dogs || []
    })
}

const updateDogImage = async newDog => {
  deleteImage(newDog.owner.uid, 'dogs/' + newDog.id)
  return await uploadImage(
    newDog.imageUri,
    newDog.owner.uid,
    'dogs/' + newDogRef.id
  )
}
