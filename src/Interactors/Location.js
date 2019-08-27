import GeoFire from "geofire"
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import '@react-native-firebase/firestore';
import '@react-native-firebase/auth';

const db = firebase.database()

const dogsRef = db.ref("dogs")
const dogLocationsRef = db.ref("locations/dogs")
const usersLocationsRef = db.ref("locations/users")

export const updateUserLocation = async userId => {
  const location = await getCurrentLocation()

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
    navigator.geolocation.getCurrentPosition(
      loc => resolve([loc.coords.latitude, loc.coords.longitude]),
      error => reject(error)
    )
  })
}

const updateDogLocationsForUser = (userId, location) => {
  return dogsRef
    .child(userId)
    .once("value")
    .then(dogs => {
      dogs.forEach(dogSnap => {
        const dogId = dogSnap.key
        new GeoFire(dogLocationsRef).set(dogId, location)
      })
    })
}
