import firestore from '@react-native-firebase/firestore'

export const followUser = async userId => _follow(userId, true)

export const unfollowUser = userId => _follow(userId, false)

const _follow = (userId, shouldFollow) => {
  const users = firestore().collection('users')
  const operation = shouldFollow
    ? firestore.FieldValue.arrayUnion
    : firestore.FieldValue.arrayRemove
  const updateFollowing = users
    .doc(global.user.uid)
    .update({ following: operation(userId) })
  const updateFollowers = users
    .doc(userId)
    .update({ followers: operation(global.user.uid) })

  return Promise.all([updateFollowing, updateFollowers])
}

export const amIFollowing = userId => {
  const users = firestore().collection('users')
  return users
    .doc(userId)
    .get()
    .then(doc => doc.data().followers || [])
    .then(followers => followers.includes(global.user.uid))
}

/**
 * [UNDER CONSTRUCTION]
 * Return an array of users (uid's) that follow the
 * user whose userId is provided.
 */
// export const getFollowersForUser = async userId => {
//   const followersRefForUser = await followersRef.child(userId).once('value')
//   return Object.keys(followersRefForUser.val() || {})
// }
