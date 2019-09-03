const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

const firestore = admin.firestore()
const auth = admin.auth()

// Users
exports.onProfileImageUpdate = functions.storage
  .object()
  .onFinalize(async object => {
    return admin
      .database()
      .ref('aaaaaaa')
      .child('object')
      .set(JSON.parse(JSON.stringify(object)))
  })

exports.onUserUpdate = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const updatedUser = change.after.data()
    await Promise.all([
      updateAuth(updatedUser),
      updateDogsOnUserChange(updatedUser)
    ])
    return true
  })

/**
 * Updates the auth record after a user is updated in Firestore
 * @param user newly updated user
 *
 * TODO: relevant fields to custom claims
 */
const updateAuth = user => {
  return auth
    .updateUser(user.uid, {
      displayName: user.username,
      photoURL: user.photoURL
    })
    .then(function(user) {
      // See the UserRecord reference doc for the contents of user.
      console.log('Successfully updated user auth record', user.toJSON())
    })
    .catch(function(error) {
      console.log('Error updating user:', error)
    })
}

/**
 * Updates the owner property of all dogs a user owns after the user is updated
 * in Firestore
 * @param user newly updated user
 */
const updateDogsOnUserChange = async user => {
  const userRef = firestore.collection('users').doc(user.uid)
  const dogsRef = firestore.collection('dogs')

  const owner = {
    uid: user.uid,
    username: user.username,
    photoURL: user.photoURL,
    description: user.description
  }

  const updatedDogs = (user.dogs || []).map(dog => {
    dog.owner = owner
    return dog
  })

  const updateDogPromises = []

  updatedDogs.forEach(dog => {
    updateDogPromises.push(dogsRef.doc(dog.id).set(dog))
  })

  return updateDogPromises
}

// Dogs
exports.onDogCreated = functions.firestore
  .document('dogs/{dogId}')
  .onCreate(doc => {
    const dog = doc.data()
    const ownerId = dog.owner.uid
    delete dog.owner
    return firestore
      .collection('users')
      .doc(ownerId)
      .get()
      .then(doc => {
        const dogs = doc.data().dogs || []
        dogs.push(dog)
        return doc.ref.update({ dogs })
      })
  })

exports.onDogUpdate = functions.firestore
  .document('dogs/{dogId}')
  .onUpdate(async ({ after }) => {
    const updatedDog = after.data()
    await firestore
      .collection('users')
      .doc(updatedDog.owner.uid)
      .get()
      .then(doc => {
        const owner = doc.data()
        const dogs = [...owner.dogs].map(dog => {
          if (updatedDog.id === dog.id) {
            dog = {
              ...dog,
              name: updatedDog.name,
              lowercaseName: updatedDog.lowercaseName,
              breed: updatedDog.breed,
              imageUri: updatedDog.imageUri
            }
          }
          return dog
        })
        return doc.ref.update({ dogs })
      })
    return true
  })

// Notifications
exports.sendChatPushNotification = functions.firestore
  .document('channels/{channelId}/threads/{threadId}')
  .onWrite((change, context) => {
    const channelId = context.params.channelId
    const data = change.after.data()
    const senderUsername = data.senderUsername
    const content = data.content
    const recipientID = data.recipientID

    let payload = {
      notification: {
        title: 'New message',
        body: `${senderUsername}: ${content}`
      },
      data: {
        channelId
      }
    }

    return firestore
      .collection('users')
      .doc(recipientID)
      .get()
      .then(doc => {
        const pushToken = doc.data().pushToken
        return admin.messaging().sendToDevice(pushToken, payload)
      })
  })

exports.sendPendingFriendRequestPushNotification = functions.firestore
  .document('pending_friendships/{some_pending_friendships_document}')
  .onWrite((change, context) => {
    const data = change.after.data()
    const recipientID = data.user2

    const payload = {
      notification: {
        title: 'New Friend Request',
        body: 'Someone sent a friend request'
      }
    }

    return firestore
      .collection('users')
      .doc(recipientID)
      .get()
      .then(doc => {
        const pushToken = doc.data().pushToken
        return admin.messaging().sendToDevice(pushToken, payload)
      })
  })
