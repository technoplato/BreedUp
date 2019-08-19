const functions = require("firebase-functions")
const admin = require("firebase-admin")

admin.initializeApp()

const firestore = admin.firestore()

exports.sendChatPushNotification = functions.firestore
  .document("channels/{some_channel_document}/threads/{some_thread_document}")
  .onWrite((change, context) => {
    const data = change.after.data()
    const senderUsername = data.senderUsername
    const content = data.content
    const recipientID = data.recipientID

    let payload = {
      notification: {
        title: "New message",
        body: `${senderUsername}: ${content}`
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
