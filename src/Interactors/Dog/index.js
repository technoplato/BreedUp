import firebase from '@react-native-firebase/app'
import '@react-native-firebase/database'
import '@react-native-firebase/firestore'
import '@react-native-firebase/auth'
import _ from 'lodash'

import {
  dogsRef,
  uploadImage,
  deleteImage,
  dogNamesRef
} from '../../Utils/FirebaseUtils'

import { updateUserLocation } from '../Location'

/**
 * Adds a dog to a user's list of dogs.
 */
const addDog = async (ownerId, name, breed, imageUri) => {
  // Get new dog ref
  // const newDogRef = firebase.firestore().collection("users").doc(ownerId).collection("dogs").doc()
  const newDogRef = dogsRef.child(ownerId).push()

  const url = await uploadImage(imageUri, ownerId, 'dogs/' + newDogRef.key)
  const owner = await firebase
    .database()
    .ref()
    .child('users')
    .child(ownerId)
    .once('value')
    .then(snap => snap.val())

  const newDog = {
    name: name,
    imageUri: url,
    breed: breed,
    ownerId: ownerId,
    id: newDogRef.key
  }

  const dogImagesRef = firebase
    .database()
    .ref()
    .child('names/users')
    .child(ownerId)
    .child('dogs')

  const dogImages = await dogImagesRef
    .once('value')
    .then(snap => snap.val() || [])

  dogImages.push(newDog.imageUri)
  dogImagesRef.set(dogImages)

  await newDogRef.set(newDog)
  await dogNamesRef.child(newDog.id).set({
    dog: newDog,
    dogName: newDog.name,
    owner: {
      uid: ownerId,
      name: owner.username,
      photoURL: owner.photoURL,
      description: owner.description
    }
  })
  await updateUserLocation(ownerId)

  return Promise.resolve(newDog)
}

const updateDog = async (oldDog, newDog) => {
  // Get a reference to the old dog ref
  const newDogRef = dogsRef.child(oldDog.ownerId).child(oldDog.id)
  // Check if we need to upload new image
  if (oldDog.imageUri !== newDog.imageUri) {
    const dogImagesRef = firebase
      .database()
      .ref()
      .child('names/users')
      .child(ownerId)
      .child('dogs')

    const oldDogImages = await dogImagesRef
      .once('value')
      .then(snap => snap.val() || [])
    _.delete(oldDogImages, oldDog.imageUri)

    // Delete old image
    deleteImage(oldDog.ownerId, 'dogs/' + newDogRef.key)
    return uploadImage(
      newDog.imageUri,
      oldDog.ownerId,
      'dogs/' + newDogRef.key
    ).then(url => {
      oldDogImages.push(url)
      dogImagesRef.set(oldDogImages)
      newDog['imageUri'] = url
      return newDogRef.set(newDog).then(() => {
        return newDog
      })
    })
  } else {
    return newDogRef.update(newDog).then(() => newDog)
  }
}

const fetchDogsForUser = async ownerId => {
  const dogsSnap = await dogsRef.child(ownerId).once('value')

  return Object.values(dogsSnap.val() || {})
}

export { addDog, updateDog, fetchDogsForUser }
