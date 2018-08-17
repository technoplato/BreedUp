import { fromEvent } from 'rxjs'
import { map } from 'rxjs/operators'
import { commentsRef, currentUser } from '../../Utils/FirebaseUtils'

addComment = (postId, text) => {
  const ref = commentsRef.child(postId).push()

  return ref.set({
    author: currentUser.displayName,
    time_posted: new Date().getTime(),
    reverse_timestamp: -1 * new Date().getTime(),
    text: text,
    key: ref.key
  })
}

fetchCommentsForPost = async postId => {
  const snap = await commentsRef.child(postId).once('value')
  return {
    count: snap.numChildren() || 0,
    fetchedComments: Object.values(snap.val() || {})
  }
}

observeCommentsForPost = postId => {
  return fromEvent(commentsRef.child(postId), 'child_added').pipe(
    map(event => {
      return event[0].val()
    })
  )
}

stopObservingCommentsForPost = postId => {
  commentsRef.child(postId).off
}

export {
  addComment,
  fetchCommentsForPost,
  observeCommentsForPost,
  stopObservingCommentsForPost
}
