const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

const firestore = admin.firestore()
const auth = admin.auth()

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
    return await Promise.all([
      updateAuth(updatedUser),
      updateDogsOnUserChange(updatedUser)
    ])
  })

/**
 * Updates the auth record after a user is updated in Firestore
 * @param user newly updated user
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
    /* uid always remains constant */
    username: user.username,
    photoURL: user.photoURL,
    description: user.description
  }
  const dogsUpdate = [...user.dogs].map(dog => {
    dog.owner = owner
    return dog
  })

  const updateDogPromises = []

  updateDogPromises.push(userRef.update({ dogs: dogsUpdate }))

  dogsUpdate.forEach(dog => {
    updateDogPromises.push(dogsRef.doc(dog.id).set(dog))
  })

  return updateDogPromises
}

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
