import database from '@react-native-firebase/database'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import auth from '@react-native-firebase/auth'

const rootRef = database().ref()

const POSTS = 'posts'
const postsRef = rootRef.child(POSTS)

const GLOBAL_FEED = 'all_posts'
const globalFeedRef = rootRef.child(GLOBAL_FEED)

const COMMENTS = 'comments'
const commentsRef = rootRef.child(COMMENTS)

const USERS = 'users'
const usersRef = rootRef.child(USERS)

const LIKES = 'likes'
const likesRef = rootRef.child(LIKES)

const DOGS = 'dogs'
const dogsRef = rootRef.child(DOGS)

const FOLLOWING = 'following'
const followingRef = rootRef.child(FOLLOWING)

const FOLLOWERS = 'followers'
const followersRef = rootRef.child(FOLLOWERS)

const BLOCKED = 'blocked'
const blockedRef = rootRef.child(BLOCKED)

const NAMES = 'names'
const namesRef = rootRef.child(NAMES)
const userNamesRef = namesRef.child(USERS)
const dogNamesRef = namesRef.child(DOGS)

const EVENTS = 'events'
export const eventsRef = rootRef.child(EVENTS)

/**
 * Convenient access to current authed user
 */
const currentUser = () => {
  return global.user
}

/**
 * Deletes an image from Firebase storage and returns true to resolve the promise.
 */
const deleteImage = (userId, path) => {
  return storage()
    .ref()
    .child(userId)
    .child(path)
    .delete()
    .then(() => true)
    .catch(() => false)
}

const postImageUploadPath = 'posts/images/'

export {
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
