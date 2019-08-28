const functions = require("firebase-functions")
const admin = require("firebase-admin")

admin.initializeApp()

const firestore = admin.firestore()

const removeFuncs = obj => JSON.parse(JSON.stringify(obj))

exports.onUserSignup = functions.auth.user().onCreate(userRecord => {
  const user = removeFuncs(userRecord)
  // Create user in "users" collection
  return firestore
    .collection("users")
    .doc(user.uid)
    .set(user)
})

exports.sendChatPushNotification = functions.firestore
  .document("channels/{channelId}/threads/{threadId}")
  .onWrite((change, context) => {
    const channelId = context.params.channelId
    const data = change.after.data()
    const senderUsername = data.senderUsername
    const content = data.content
    const recipientID = data.recipientID

    let payload = {
      notification: {
        title: "New message",
        body: `${senderUsername}: ${content}`
      },
      data: {
        channelId
      }
    }

    return firestore
      .collection("users")
      .doc(recipientID)
      .get()
      .then(doc => {
        const pushToken = doc.data().pushToken
        return admin.messaging().sendToDevice(pushToken, payload)
      })
  })

exports.sendPendingFriendRequestPushNotification = functions.firestore
  .document("pending_friendships/{some_pending_friendships_document}")
  .onWrite((change, context) => {
    const data = change.after.data()
    const recipientID = data.user2

    const payload = {
      notification: {
        title: "New Friend Request",
        body: "Someone sent a friend request"
      }
    }

    return firestore
      .collection("users")
      .doc(recipientID)
      .get()
      .then(doc => {
        const pushToken = doc.data().pushToken
        return admin.messaging().sendToDevice(pushToken, payload)
      })
  })
