import { Image } from 'react-native'

import { getFollowersForUser } from '../Users'
import {
  rootRef,
  postsRef,
  globalFeedRef,
  uploadImage,
  postImageUploadPath,
  currentUser
} from '../../Utils/FirebaseUtils'

import firestore from '@react-native-firebase/firestore'
// import { stat } from 'react-native-fs'
// import RNFetchBlob from 'rn-fetch-blob'
/**
 * Utility method for creating a post. Also uploads image for post
 */
const createPost = async (imageUri, text, dogs) => {
  Image.getSize(imageUri, (width, height) => {
    console.log('width: ', width)
    console.log('height: ', height)
  })

  // try {
  //   const statResult = await stat(imageUri)
  //   console.log('file size: ' + statResult.size)
  //   console.log('stats: ', statResult)
  // } catch (e) {}

  try {
    // RNFetchBlob.fs
    //   .stat(PATH_OF_THE_TARGET)
    //   .then(stats => {
    //     console.log(stats)
    //   })
    //   .catch(err => {})
  } catch (e) {}

  try {
  } catch (e) {}

  await new Promise(res => {})

  // const { uid, displayName, photoURL } = currentUser()
  // First, I need to upload the image
  // const postImgUrl = await uploadImageForPost(imageUri, uid)
  // // Create a reference to where the post is going in order to get a key
  // const postDoc = firestore()
  //   .collection('posts')
  //   .doc()
  // // Create the post object
  // const post = {
  //   author: {
  //     username: displayName,
  //     photo: photoURL,
  //     uid: uid
  //   },
  //   dogs: dogs,
  //   id: postDoc.id,
  //   text: text,
  //   postPhoto: postImgUrl
  // }
  // return post
}

/**
 * Broadcasts post to the poster's followers
 * and adds the post to the user's list of posts.
 *
 * Returns post after succesful upload.
 */
const submitPost = async post => {
  return post
  // TODO Firebase cloud function for this if necessary
  // updatePostsForFollowers(post)
  const postSnap = await addOrUpdatePost(post)
  return post
}

/**
 * Uploads an image for a post and returns the URL
 */
const uploadImageForPost = async (postImgUri, authorId) => {
  return await uploadImage(postImgUri, authorId, postImageUploadPath)
}

/**
 * Adds or updates post to user's list of posts to be shown
 * on profile view.
 */
const addOrUpdatePost = post => {
  return firestore()
    .collection('posts')
    .doc(post.id)
    .set(post)
}

/**
 * Adds or updates a post to all of a user's followers.
 *
 * Also, early on we want to show every user every post and
 * so we do so here.
 */
const updatePostsForFollowers = async post => {
  // This is only going to be used early on, as we want to
  // show every post to every user.
  const globalFeedPostSnap = await postToGlobalFeed(post)

  const followers = await getFollowersForUser(post.author.uid)
  const fanoutObj = fanoutPost(followers, post)
  return rootRef.update(fanoutObj)
}

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

export { createPost, submitPost }
