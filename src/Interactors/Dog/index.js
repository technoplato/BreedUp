import firestore from '@react-native-firebase/firestore'
import uploadImage from 'utilities/upload-image'

import { deleteImage } from '../../Utils/FirebaseUtils'

export const addDog = async (ownerId, name, breed, imageUri) => {
  const userRef = firestore()
    .collection('users')
    .doc(ownerId)
  const { uid, username, photo, description } = await userRef
    .get()
    .then(doc => doc.data())
  const owner = { uid, username, photo, description }
  const newDogRef = firestore()
    .collection('dogs')
    .doc()
  const newImageUri = await uploadImage(
    imageUri,
    `${ownerId}/dogs/${newDogRef.id}`
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

  newDog.lowercaseName = newDog.name.toLocaleLowerCase()

  return firestore()
    .collection('dogs')
    .doc(newDog.id)
    .set(newDog)
}

export const fetchDogsForUser = async ownerId => {
  return await firestore()
    .collection('dogs')
    .where('owner.uid', '==', ownerId)
    .get()
    .then(snap => {
      const dogs = []
      snap.forEach(dogDoc => {
        dogs.push(dogDoc.data())
      })
      return dogs
    })
}

const updateDogImage = async newDog => {
  deleteImage(newDog.owner.uid, 'dogs/' + newDog.id)
  return await uploadImage(
    newDog.imageUri,
    `${newDog.owner.uid}/dogs/${newDog.id}`
  )
}
