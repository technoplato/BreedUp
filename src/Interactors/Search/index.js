import { GeoFire } from 'geofire'
import { getCurrentLocation } from '../Location'
import firestore from '@react-native-firebase/firestore'
import { database } from '../../config'

// This seems very random but is used to limit search to prefixes of search content
const HIGH_UNICODE_VAL = '\uf8ff'

const SEARCH_RESULTS_COUNT = 10

const getAllNearby = async (ref, radius, center) => {
  const query = new GeoFire(ref).query({
    radius,
    center
  })

  const nearby = []

  query.on('key_entered', (key, location, distance) => {
    nearby.push({
      key,
      location,
      distance
    })
  })

  await new Promise(resolve => query.on('ready', () => resolve()))

  return nearby
}

/**
 * Searches for user based on starting text of username.
 *
 * Returns array of results.
 */
export const searchUsers = async usernamePrefix => {
  if (!usernamePrefix) return []

  const usersArray = await firestore()
    .collection('users')
    .where('lowercaseUsername', '>=', usernamePrefix)
    .where('lowercaseUsername', '<=', usernamePrefix + HIGH_UNICODE_VAL)
    .limit(SEARCH_RESULTS_COUNT)
    .get()
    .then(snapshot => {
      const results = []
      snapshot.forEach(doc => {
        const userDoc = doc.data()
        results.push({
          description: userDoc.description,
          uid: userDoc.uid,
          username: userDoc.username,
          photoURL: userDoc.photoURL,
          dogs: userDoc.dogs
        })
      })
      return results
    })

  return normalizeUsers(usersArray)
}

export const searchNearbyUsers = async (usernamePrefix, km = 15) => {
  const nearbyUserLocations = await getAllNearby(
    database.ref('locations').child('users'),
    15,
    await getCurrentLocation()
  )

  const nearbyUserPromises = []
  nearbyUserLocations.forEach(userLocation => {
    nearbyUserPromises.push(
      firestore()
        .collection('users')
        .doc(userLocation.key)
        .get()
        .then(userDoc => {
          const user = { ...userDoc.data(), distance: userLocation.distance }

          if (!usernamePrefix) {
            // Return all users if no query is provided
            return user
          }

          if (user.username.startsWith(usernamePrefix)) {
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
export const searchDogs = async dogNamePrefix => {
  if (!dogNamePrefix) return []

  const dogArray = await firestore()
    .collection('dogs')
    .where('lowercaseName', '>=', dogNamePrefix)
    .where('lowercaseName', '<=', dogNamePrefix + HIGH_UNICODE_VAL)
    .limit(SEARCH_RESULTS_COUNT)
    .get()
    .then(snapshot => {
      const results = []
      snapshot.forEach(doc => {
        const dogDoc = doc.data()
        results.push({
          owner: dogDoc.owner,
          dog: {
            ...dogDoc,
            owner: null
          }
        })
      })
      return results
    })

  return normalizeDogs(dogArray)
}

export const searchNearbyDogs = async (dognamePrefix, km = 15) => {
  const nearbyDogLocations = await getAllNearby(
    database.ref('locations').child('dogs'),
    15,
    await getCurrentLocation()
  )

  const nearbyDogPromises = []
  nearbyDogLocations.forEach(dogLocation => {
    nearbyDogPromises.push(
      firestore()
        .collectionGroup('dogs')
        .where('id', '==', dogLocation.key)
        .limit(1)
        .get()
        .then(collectionSnapshot => {
          const dogDoc = collectionSnapshot.docs[0]
          if (!dogDoc || !dogDoc.exists) {
            return null
          }

          const dogRecord = dogDoc.data()
          const dog = {
            owner: dogRecord.owner,
            dog: { ...dogRecord, owner: null }
          }

          if (!dognamePrefix) {
            return dog
          }

          if (dog.dog.dogName.startsWith(dognamePrefix)) {
            return dog
          }
        })
    )
  })

  const nearbyDogs = await Promise.all(nearbyDogPromises)

  return normalizeDogs(nearbyDogs)
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
          username: user.username,
          photoURL: user.photoURL
        },
        dogs: user.dogs
      }
    })
}

const normalizeDogs = dogs => {
  return dogs
    .filter(d => !!d)
    .map(dog => {
      console.log(dog)
      return {
        type: 'dog',
        owner: dog.owner,
        dogs: [dog.dog]
      }
    })
}

function dummyData() {
  const floridaId = 'StPAd7CuxhRLvScAQSD0Yuph6qj2'
  const floridaCoords = [37.785834, -122.406417]
  const africaId = 'KkMYhK5jQURDSJWf1qx8iO6uk7U2'
  const africaCoords = [8, 32]
  const dubaiId = 'LzO3St3cjVUpI3mcMpdfoKElj722'
  const dubaiCoords = [25, 55]
  const userLocationsRef = database.ref('locations').child('users')
  new GeoFire(userLocationsRef).set(floridaId, floridaCoords)
  new GeoFire(userLocationsRef).set(africaId, africaCoords)
  new GeoFire(userLocationsRef).set(dubaiId, dubaiCoords)
}
