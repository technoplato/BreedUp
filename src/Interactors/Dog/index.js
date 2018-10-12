import { dogsRef, uploadImage, deleteImage } from '../../Utils/FirebaseUtils'

/**
 * Adds a dog to a user's list of dogs.
 */
addDog = (ownerId, name, breed, imageUri) => {
  // Get new dog ref
  const newDogRef = dogsRef.child(ownerId).push()
  // Upload image of dog
  return uploadImage(imageUri, ownerId, 'dogs/' + newDogRef.key).then(url => {
    // Store new dog at /dogs/ { userId } / { new dog ID }
    const newDog = {
      name: name,
      imageUri: url,
      breed: breed,
      ownerId: ownerId,
      key: newDogRef.key
    }
    return newDogRef.set(newDog).then(() => {
      return newDog
    })
  })
}

updateDog = (oldDog, newDog) => {
  // Get a reference to the old dog ref
  const newDogRef = dogsRef.child(oldDog.ownerId).child(oldDog.key)
  // Check if we need to upload new image
  if (oldDog.imageUri !== newDog.imageUri) {
    // Delete old image
    deleteImage(oldDog.ownerId, 'dogs/' + newDogRef.key)
    return uploadImage(
      newDog.imageUri,
      oldDog.ownerId,
      'dogs/' + newDogRef.key
    ).then(url => {
      // Store new dog at /dogs/ { userId } / { new dog ID }
      newDog['imageUri'] = url
      return newDogRef.set(newDog).then(() => {
        return newDog
      })
    })
  } else {
    return newDogRef.update(newDog).then(() => newDog)
  }
}

fetchDogsForUser = async ownerId => {
  const dogsSnap = await dogsRef.child(ownerId).once('value')

  return Object.values(dogsSnap.val() || {})
}

// unfollowUser = userId => {
//   return followingRef
//     .child(currentUser.uid)
//     .child(userId)
//     .set(false)
//     .then(() => {
//       followersRef
//         .child(userId)
//         .child(currentUser.uid)
//         .set(false)
//     })
// }

export { addDog, updateDog, fetchDogsForUser }
