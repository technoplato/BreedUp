import firestore from '@react-native-firebase/firestore'
import uploadImage from 'utilities/upload-image'

import { postsRef, postImageUploadPath } from '../../Utils/FirebaseUtils'

/**
 * Utility method for creating a post. Also uploads image for post
 */
const createPost = async (imageUri, text, dogs) => {
  const { uid, username, photo } = global.user

  // Create a reference to where the post is going in order to get a key
  const postDoc = firestore()
    .collection('posts')
    .doc()

  const postImgUrl = await uploadImageForPost(imageUri, uid, postDoc.id)

  const post = {
    author: {
      username: username,
      photo: photo,
      uid: uid
    },
    dogs: dogs,
    id: postDoc.id,
    text: text,
    postPhoto: postImgUrl
  }

  await addOrUpdatePost(post)

  return post
}

/**
 * Uploads an image for a post and returns the URL
 */
const uploadImageForPost = async (postImgUri, authorId, postId) => {
  return await uploadImage(postImgUri, `${authorId}/posts/${postId}`)
}

/**
 * Adds or updates post to user's list of posts to be shown
 * on profile view.
 */
export const addOrUpdatePost = post => {
  return firestore()
    .collection('posts')
    .doc(post.id)
    .set(post)
}

/**
 * [UNDER CONSTRUCTION]
 * Adds or updates a post to all of a user's followers.
 *
 * Also, early on we want to show every user every post and
 * so we do so here.
 */
// const updatePostsForFollowers = async post => {
//   // This is only going to be used early on, as we want to
//   // show every post to every user.
//   const globalFeedPostSnap = await postToGlobalFeed(post)
//
//   const followers = await getFollowersForUser(post.author.uid)
//   const fanoutObj = fanoutPost(followers, post)
//   return rootRef.update(fanoutObj)
// }

/**
 * Only used in early app development process. To be removed.
 *
 * Adds post to global feed.
 */
// const postToGlobalFeed = async post => {
//   return await globalFeedRef.child(post.key).set(post)
// }

/**
 * Returns array of posts made by user.
 *
 * Currently used on ProfileScreen view.
 */
const getPosts = async userId => {
  const postsSnap = await postsRef.child(userId).once('value')
  return Object.values(postsSnap.val())
}

/**
 * Creates an object to update all posts on Firebase for all followers.
 * @param {array} followers
 * @param {post} post
 */
function fanoutPost(followers, post) {
  var fanoutObj = {}
  // write to each follower's timeline
  followers.forEach(
    userId => (fanoutObj['/feed/' + userId + '/' + post.key] = post)
  )
  return fanoutObj
}

export { createPost }
