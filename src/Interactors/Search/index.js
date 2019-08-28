import { userNamesRef, dogNamesRef } from '../../Utils/FirebaseUtils'
import GeoFire from 'geofire'
import { getCurrentLocation } from '../Location'
import database from '@react-native-firebase/database'

// This seems very random but is used to limit search to prefixes of search content
const HIGH_UNICODE_VAL = '\uf8ff'

/**
 * Searches for user based on starting text of username.
 *
 * Returns array of results.
 */
const searchUsers = async usernamePrefix => {
  if (!usernamePrefix) return []

  const usersArray = await userNamesRef
    .orderByChild('username')
    .startAt(usernamePrefix)
    .endAt(usernamePrefix + HIGH_UNICODE_VAL)
    .limitToFirst(5)
    .once('value')
    .then(snap => {
      const keysArray = Object.keys(snap.val() || [])
      const results = keysArray.map(key => snap.val()[key])
      return results
    })

  return normalizeUsers(usersArray)
}

const searchNearbyUsers = async (usernamePrefix, km = 15) => {
  const usernameLocationsRef = database().ref('locations/users')

  const geofire = new GeoFire(usernameLocationsRef)

  const currentLocation = await getCurrentLocation()

  const query = geofire.query({
    center: currentLocation,
    radius: km
  })

  const nearbyUserLocations = []

  query.on('key_entered', (key, location, distance) => {
    nearbyUserLocations.push({
      key,
      location,
      distance
    })
  })

  await new Promise(resolve => query.on('ready', () => resolve()))

  const nearbyUserPromises = []
  nearbyUserLocations.forEach(user => {
    nearbyUserPromises.push(
      userNamesRef
        .child(user.key)
        .once('value')
        .then(snap => snap.val())
        .then(user => {
          console.log('searchNearbyUsers')
          console.log(user)
          if (user && user.username.startsWith(usernamePrefix)) {
            return user
          }
        })
    )
  })

  const nearbyUsers = await Promise.all(nearbyUserPromises)

  return normalizeUsers(nearbyUsers)
}

/**
 * Searches for dog based on starting text of dog name.
 *
 * Returns array of results.
 */
const searchDogs = async dogNamePrefix => {
  if (!dogNamePrefix) return []

  const dogArray = await dogNamesRef
    .orderByChild('dogName')
    .startAt(dogNamePrefix)
    .endAt(dogNamePrefix + HIGH_UNICODE_VAL)
    .limitToFirst(5)
    .once('value')
    .then(snap => {
      const keysArray = Object.keys(snap.val() || [])
      const results = keysArray.map(key => snap.val()[key])
      return results
    })

  return normalizeDogs(dogArray)
}

export const searchNearbyDogs = async (dognamePrefix, km = 15) => {
  const dogLocationsRef = database().ref('locations/dogs')

  const geofire = new GeoFire(dogLocationsRef)

  const currentLocation = await getCurrentLocation()

  const query = geofire.query({
    center: currentLocation,
    radius: km
  })

  const nearbyDogLocations = []

  query.on('key_entered', (key, location, distance) => {
    nearbyDogLocations.push({
      key,
      location,
      distance
    })
  })

  await new Promise(resolve => query.on('ready', () => resolve()))

  const nearbyDogPromises = []
  nearbyDogLocations.forEach(dogLocation => {
    nearbyDogPromises.push(
      dogNamesRef
        .child(dogLocation.key)
        .once('value')
        .then(snap => snap.val())
        .then(dog => {
          if (dog.dogName.startsWith(dognamePrefix)) {
            return dog
          }
        })
    )
  })

  const nearbyUsers = await Promise.all(nearbyDogPromises)

  return normalizeDogs(nearbyUsers)
}

const normalizeDogs = dogs => {
  return dogs
    .filter(d => !!d)
    .map(dog => ({
      type: 'dog',
      owner: dog.owner,
      dogs: [dog.dog]
    }))
}

const normalizeUsers = users => {
  return users
    .filter(u => !!u)
    .map(user => {
      return {
        type: 'person',
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

export { searchUsers, searchNearbyUsers, searchDogs }
