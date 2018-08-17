import firebase from 'react-native-firebase'

const rootRef = firebase.database().ref()

const COMMENTS = 'comments'
const commentsRef = rootRef.child(COMMENTS)

/**
 * This is a hack I'm using because, for some reason, exporting
 * `firebase.auth().currentUser` is null.
 *
 * Will look into this in the future, but it does its job well enough for now.
 */
let currentUser
firebase.auth().onAuthStateChanged(user => {
  currentUser = user
})

export { commentsRef, currentUser }
