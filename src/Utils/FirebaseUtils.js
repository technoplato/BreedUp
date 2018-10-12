import firebase from 'react-native-firebase'

const rootRef = firebase.database().ref()

const POSTS = 'posts'
const postsRef = rootRef.child(POSTS)

const COMMENTS = 'comments'
const commentsRef = rootRef.child(COMMENTS)

const USERS = 'users'
const usersRef = rootRef.child(USERS)

const DOGS = 'dogs'
const dogsRef = rootRef.child(DOGS)

const FOLLOWING = 'following'
const followingRef = rootRef.child(FOLLOWING)

const FOLLOWERS = 'followers'
const followersRef = rootRef.child(FOLLOWERS)

const BLOCKED = 'blocked'
const blockedRef = rootRef.child(BLOCKED)

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

/**
 * Uploads an image to Firebase and returns the URL.
 */
uploadImage = (imageUri, userId, path) => {
  // Create ref for storing image
  const storageRef = firebase
    .storage()
    .ref()
    .child(userId)
    .child(path)

  // Save photo to Firebase storage and return URL where photo is stored
  return storageRef
    .put(imageUri)
    .then(snapshot => snapshot.downloadURL)
    .then(url => {
      return url
    })
}

/**
 * Deletes an image from Firebase storage and returns true to resolve the promise.
 */
deleteImage = (userId, path) => {
  firebase
    .storage()
    .ref()
    .child(userId)
    .child(path)
    .delete()
    .then(() => true)
}

export {
  /**
   * Utility methods
   */
  uploadImage,
  deleteImage,
  /**
   * Firebase references
   */
  postsRef,
  commentsRef,
  usersRef,
  dogsRef,
  followingRef,
  followersRef,
  blockedRef,
  /**
   * User info
   */
  currentUser
}
