import { fromEvent } from 'rxjs'
import { map } from 'rxjs/operators'
import {
  currentUser,
  followersRef,
  followingRef
} from '../../Utils/FirebaseUtils'

followUser = userId => {
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

unfollowUser = userId => {
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

isFollowing = userId => {
  return followingRef
    .child(currentUser.uid)
    .child(userId)
    .once('value')
    .then(snap => {
      return !!snap.val()
    })
}

export { followUser, unfollowUser, isFollowing }
