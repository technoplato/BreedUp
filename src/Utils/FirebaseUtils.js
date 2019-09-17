import database from '@react-native-firebase/database'
import storage from '@react-native-firebase/storage'

const rootRef = database().ref()

const POSTS = 'posts'
const postsRef = rootRef.child(POSTS)

const FOLLOWING = 'following'
const followingRef = rootRef.child(FOLLOWING)

const FOLLOWERS = 'followers'
const followersRef = rootRef.child(FOLLOWERS)

const BLOCKED = 'blocked'
const blockedRef = rootRef.child(BLOCKED)

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
  followingRef,
  followersRef,
  /**
   * Constants
   */
  postImageUploadPath,
  /**
   * User info
   */
  currentUser
}
