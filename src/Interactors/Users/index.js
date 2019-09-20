import {
  currentUser,
  followersRef,
  followingRef
} from '../../Utils/FirebaseUtils'

export const followUser = userId => {
  return followingRef
    .child(currentUser.uid)
    .child(userId)
    .set(true)
    .then(() => {
      followersRef
        .child(userId)
        .child(currentUser.uid)
        .set(true)
    })
}

export const unfollowUser = userId => {
  return followingRef
    .child(currentUser.uid)
    .child(userId)
    .set(false)
    .then(() => {
      followersRef
        .child(userId)
        .child(currentUser.uid)
        .set(false)
    })
}

export const isFollowing = userId => {
  return false
  // return followingRef
  //   .child(global.user.uid)
  //   .child(userId)
  //   .once('value')
  //   .then(snap => {
  //     return !!snap.val()
  //   })
}

/**
 * Return an array of users (uid's) that follow the
 * user whose userId is provided.
 */
export const getFollowersForUser = async userId => {
  const followersRefForUser = await followersRef.child(userId).once('value')
  return Object.keys(followersRefForUser.val() || {})
}
