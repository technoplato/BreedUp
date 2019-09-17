import { fromEvent } from 'rxjs'
import firestore from '@react-native-firebase/firestore'
import { map } from 'rxjs/operators'
import { commentsRef, postsRef, currentUser } from '../../Utils/FirebaseUtils'
import { addOrUpdatePost } from '../Posts'

export const addComment = async (oldPost, text) => {
  const postDoc = firestore()
    .collection('posts')
    .doc(oldPost.id)
  const newCommentDoc = postDoc.collection('comments').doc()

  const newComment = {
    author: currentUser().displayName,
    time_posted: new Date().getTime(),
    text: text,
    id: newCommentDoc.id
  }

  await newCommentDoc.set(newComment)

  // // TODO: Moving this to cloud functions
  const newPost = await firestore()
    .runTransaction(transaction => {
      return transaction.get(postDoc).then(doc => {
        if (!doc.exists) {
          throw 'Document does not exist for Post with ID: ' + oldPost.id
        }

        const post = doc.data()
        const commentCount = post.commentCount
        if (commentCount === 0) {
          post['commentCount'] = 1
          post['first_comment'] = newComment
        } else if (commentCount === 1) {
          post['commentCount'] = 2
          post['second_comment'] = newComment
        } else {
          post['commentCount'] = post.commentCount + 1
        }

        transaction.update(postDoc, post)
        return post
      })
    })
    .catch(err => {
      console.log('Transaction failed: ', err)
    })

  console.log('After performing transaction: ', newPost)

  return addOrUpdatePost(newPost)
}

export const fetchCommentsForPost = (postId, callback) => {
  return firestore()
    .collection('posts')
    .doc(postId)
    .collection('comments')
    .orderBy('time_posted', 'desc')
    .onSnapshot(snap => {
      const comments = snap.docs.map(doc => doc.data())
      callback(comments)
    })
}

export const observeCommentsForPost = postId => {
  // TODO: port over behavior from PostList
  // return fromEvent(commentsRef.child(postId), 'child_added').pipe(
  //   map(event => {
  //     return event[0].val()
  //   })
  // )
}

export const stopObservingCommentsForPost = postId => {
  commentsRef.child(postId).off
}
