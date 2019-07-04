import { userNamesRef, dogNamesRef } from "../../Utils/FirebaseUtils"

// This seems very random but is used to limit search to prefixes of search content
const HIGH_UNICODE_VAL = "\uf8ff"

/**
 * Searches for user based on starting text of username.
 *
 * Returns array of results.
 */
searchUser = usernamePrefix => {
  if (!usernamePrefix) return []

  return userNamesRef
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
}

/**
 * Searches for dog based on starting text of dog name.
 *
 * Returns array of results.
 */
searchDog = dogNamePrefix => {
  if (!dogNamePrefix) return []

  return dogNamesRef
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
}

export { searchUser, searchDog }
