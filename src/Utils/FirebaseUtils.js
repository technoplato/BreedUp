import firebase from "react-native-firebase"

const rootRef = firebase.database().ref()

const POSTS = "posts"
const postsRef = rootRef.child(POSTS)

const GLOBAL_FEED = "all_posts"
const globalFeedRef = rootRef.child(GLOBAL_FEED)

const COMMENTS = "comments"
const commentsRef = rootRef.child(COMMENTS)

const USERS = "users"
const usersRef = rootRef.child(USERS)

const LIKES = "likes"
const likesRef = rootRef.child(LIKES)

const DOGS = "dogs"
const dogsRef = rootRef.child(DOGS)

const FOLLOWING = "following"
const followingRef = rootRef.child(FOLLOWING)

const FOLLOWERS = "followers"
const followersRef = rootRef.child(FOLLOWERS)

const BLOCKED = "blocked"
const blockedRef = rootRef.child(BLOCKED)

const NAMES = "names"
const namesRef = rootRef.child(NAMES)
const userNamesRef = namesRef.child(USERS)
const dogNamesRef = namesRef.child(DOGS)

const EVENTS = "events"
export const eventsRef = rootRef.child(EVENTS)

/**
 * Convenient access to current authed user
 */
currentUser = () => {
  return firebase.auth().currentUser
}

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
  return firebase
    .storage()
    .ref()
    .child(userId)
    .child(path)
    .delete()
    .then(() => true)
}

const postImageUploadPath = "posts/images/"

export {
  /**
   * Utility methods
   */
  uploadImage,
  deleteImage,
  /**
   * Firebase references
   */
  rootRef,
  postsRef,
  globalFeedRef,
  commentsRef,
  usersRef,
  likesRef,
  dogsRef,
  followingRef,
  followersRef,
  blockedRef,
  userNamesRef,
  dogNamesRef,
  /**
   * Constants
   */
  postImageUploadPath,
  /**
   * User info
   */
  currentUser
}
