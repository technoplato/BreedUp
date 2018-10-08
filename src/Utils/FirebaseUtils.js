import firebase from 'react-native-firebase'

const rootRef = firebase.database().ref()

const POSTS = 'posts'
const postsRef = rootRef.child(POSTS)

const COMMENTS = 'comments'
const commentsRef = rootRef.child(COMMENTS)

const USERS = 'users'
const usersRef = rootRef.child(USERS)

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

export {
  postsRef,
  commentsRef,
  usersRef,
  followingRef,
  followersRef,
  blockedRef,
  currentUser
}
