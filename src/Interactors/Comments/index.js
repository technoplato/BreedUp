import { fromEvent } from 'rxjs'
import { map } from 'rxjs/operators'
import { commentsRef, postsRef, currentUser } from '../../Utils/FirebaseUtils'

addComment = async (postId, text) => {
  const newCommentRef = commentsRef.child(postId).push()

  const newComment = {
    author: currentUser.displayName,
    time_posted: new Date().getTime(),
    text: text,
    key: newCommentRef.key
  }

  const commentAdded = await newCommentRef.set(newComment)

  const prevCommentCount = await getCommentCountForPost(postId)

  postsRef.child(postId).transaction(post => {
    if (post !== null) {
      if (prevCommentCount === 0) {
        post['comment_count'] = 1
        post['first_comment'] = newComment
      } else if (prevCommentCount === 1) {
        post['comment_count'] = 2
        post['second_comment'] = newComment
      } else {
        post['comment_count'] = post.comment_count + 1
      }
    }
    return post
  }, true)
}

getCommentCountForPost = async postId => {
  const postCommentCountSnap = await postsRef
    .child(postId)
    .child('comment_count')
    .once('value')

  return postCommentCountSnap.val() || 0
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
