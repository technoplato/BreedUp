import {
  dogsRef,
  uploadImage,
  deleteImage,
  dogNamesRef,
  currentUser
} from "../../Utils/FirebaseUtils"

/**
 * Adds a dog to a user's list of dogs.
 */
addDog = async (ownerId, name, breed, imageUri) => {
  // Get new dog ref
  const newDogRef = dogsRef.child(ownerId).push()
  // Upload image of dog
  const url = await uploadImage(imageUri, ownerId, "dogs/" + newDogRef.key)

  // Store new dog at /dogs/ { userId } / { new dog ID }
  const newDog = {
    name: name.toLowerCase(),
    imageUri: url,
    breed: breed,
    ownerId: ownerId,
    key: newDogRef.key
  }

  const newDogSnap = await newDogRef.set(newDog)
  const dogNameSnap = await dogNamesRef.child(newDog.key).set({
    dogId: newDog.key,
    ownerId: ownerId,
    owner: {
      uid: ownerId,
      name: currentUser().displayName
    },
    dogName: newDog.name
  })

  return Promise.resolve(newDog)
}

updateDog = (oldDog, newDog) => {
  // Get a reference to the old dog ref
  const newDogRef = dogsRef.child(oldDog.ownerId).child(oldDog.key)
  // Check if we need to upload new image
  if (oldDog.imageUri !== newDog.imageUri) {
    // Delete old image
    deleteImage(oldDog.ownerId, "dogs/" + newDogRef.key)
    return uploadImage(
      newDog.imageUri,
      oldDog.ownerId,
      "dogs/" + newDogRef.key
    ).then(url => {
      // Store new dog at /dogs/ { userId } / { new dog ID }
      newDog["imageUri"] = url
      return newDogRef.set(newDog).then(() => {
        return newDog
      })
    })
  } else {
    return newDogRef.update(newDog).then(() => newDog)
  }
}

fetchDogsForUser = async ownerId => {
  const dogsSnap = await dogsRef.child(ownerId).once("value")

  return Object.values(dogsSnap.val() || {})
}

export { addDog, updateDog, fetchDogsForUser }
