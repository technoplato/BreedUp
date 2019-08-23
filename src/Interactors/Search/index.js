import { userNamesRef, dogNamesRef } from "../../Utils/FirebaseUtils"

// This seems very random but is used to limit search to prefixes of search content
const HIGH_UNICODE_VAL = "\uf8ff"

/**
 * Searches for user based on starting text of username.
 *
 * Returns array of results.
 */
const searchUsers = async usernamePrefix => {
  if (!usernamePrefix) return []

  const usersArray = await userNamesRef
    .orderByChild("username")
    .startAt(usernamePrefix)
    .endAt(usernamePrefix + HIGH_UNICODE_VAL)
    .limitToFirst(5)
    .once("value")
    .then(snap => {
      const keysArray = Object.keys(snap.val() || [])
      const results = keysArray.map(key => snap.val()[key])
      return results
    })

  return normalizeUsers(usersArray)
}

/**
 * Searches for dog based on starting text of dog name.
 *
 * Returns array of results.
 */
const searchDogs = async dogNamePrefix => {
  if (!dogNamePrefix) return []

  const dogArray = await dogNamesRef
    .orderByChild("dogName")
    .startAt(dogNamePrefix)
    .endAt(dogNamePrefix + HIGH_UNICODE_VAL)
    .limitToFirst(5)
    .once("value")
    .then(snap => {
      const keysArray = Object.keys(snap.val() || [])
      const results = keysArray.map(key => snap.val()[key])
      return results
    })

  return normalizeDogs(dogArray)
}

const normalizeDogs = dogs => {
  return dogs.map(dog => ({
    owner: dog.owner,
    dogs: [dog.dog.imageUri]
  }))
}

const normalizeUsers = users => {
  return users.map(user => {
    return {
      owner: {
        description: user.description,
        uid: user.uid,
        name: user.username,
        photoURL: user.photoURL
      },
      dogs: user.dogs
    }
  })
}

export { searchUsers, searchDogs }
