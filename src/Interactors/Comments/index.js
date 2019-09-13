import { fromEvent } from 'rxjs'
import { map } from 'rxjs/operators'
import { commentsRef, postsRef, currentUser } from '../../Utils/FirebaseUtils'
import { submitPost } from '../Posts'

export const addComment = async (oldPost, text) => {
  const newCommentRef = commentsRef.child(oldPost.key).push()

  const newComment = {
    author: currentUser().displayName,
    time_posted: new Date().getTime(),
    text: text,
    key: newCommentRef.key
  }

  const commentAdded = await newCommentRef.set(newComment)

  const transaction = await postsRef
    .child(oldPost.author.uid)
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

export const fetchCommentsForPost = async postId => {
  const snap = await commentsRef.child(postId).once('value')
  return {
    count: snap.numChildren() || 0,
    fetchedComments: Object.values(snap.val() || {}).sort((a, b) => {
      return a.key > b.key
    })
  }
}

export const observeCommentsForPost = postId => {
  return fromEvent(commentsRef.child(postId), 'child_added').pipe(
    map(event => {
      return event[0].val()
    })
  )
}

export const stopObservingCommentsForPost = postId => {
  commentsRef.child(postId).off
}
