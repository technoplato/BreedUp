import { fromEvent } from 'rxjs'
import { map } from 'rxjs/operators'
import { commentsRef, postsRef, currentUser } from '../../Utils/FirebaseUtils'
import { submitPost } from '../Posts'

addComment = async (oldPost, text) => {
  const newCommentRef = commentsRef.child(oldPost.key).push()

  const newComment = {
    author: currentUser().displayName,
    time_posted: new Date().getTime(),
    text: text,
    key: newCommentRef.key
  }

  const commentAdded = await newCommentRef.set(newComment)

  const transaction = await postsRef
    .child(oldPost.author_id)
    .child(oldPost.key)
    .transaction(post => {
      if (post !== null) {
        if (post.comment_count === 0) {
          post['comment_count'] = 1
          post['first_comment'] = newComment
        } else if (post.comment_count === 1) {
          post['comment_count'] = 2
          post['second_comment'] = newComment
        } else {
          post['comment_count'] = post.comment_count + 1
        }
        return post
      } else {
        return oldPost
      }
    }, true)

  const newPost = transaction.snapshot.val()
  return submitPost(newPost)
}

fetchCommentsForPost = async postId => {
  const snap = await commentsRef.child(postId).once('value')
  return {
    count: snap.numChildren() || 0,
    fetchedComments: Object.values(snap.val() || {}).sort((a, b) => {
      return a.key > b.key
    })
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
