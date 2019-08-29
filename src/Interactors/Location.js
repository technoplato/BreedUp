import { GeoFire } from 'geofire'
import db from '@react-native-firebase/database'
import Geolocation from '@react-native-community/geolocation'

const dogsRef = db().ref('dogs')
const dogLocationsRef = db().ref('locations/dogs')
const usersLocationsRef = db()
  .ref('locations')
  .child('users')

export const updateUserLocation = async userId => {
  const location = await getCurrentLocation()
  console.log("Updating User's Location to coordinates: ", location)

  return Promise.all([
    updateDogLocationsForUser(userId, location),
    new GeoFire(usersLocationsRef).set(userId, location)
  ])
}

/**
 * Return location as an array [lat, lon]
 * @returns [lat, lon]
 */
export const getCurrentLocation = async () => {
  return await new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      loc => resolve([loc.coords.latitude, loc.coords.longitude]),
      error => reject(error)
    )
  })
}

const updateDogLocationsForUser = (userId, location) => {
  return dogsRef
    .child(userId)
    .once('value')
    .then(dogs => {
      dogs.forEach(dogSnap => {
        const dogId = dogSnap.key
        new GeoFire(dogLocationsRef).set(dogId, location)
      })
    })
}
