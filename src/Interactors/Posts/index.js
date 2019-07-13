import { getFollowersForUser } from "../Users"
import {
  rootRef,
  postsRef,
  globalFeedRef,
  uploadImage,
  postImageUploadPath,
  currentUser
} from "../../Utils/FirebaseUtils"

/**
 * Utility method for creating a post. Also uploads image for post
 */
createPost = async (imageUri, text, dogs) => {
  const { uid, displayName, photoURL } = currentUser()
  // First, I need to upload the image
  const postImgUrl = await uploadImageForPost(imageUri, uid)
  // Create a reference to where the post is going in order to get a key
  const newPostRef = postsRef.child(uid).push()
  // Create the post object
  const post = {
    author_username: displayName,
    author_img_url: photoURL,
    author_id: uid,
    dogs: dogs,
    key: newPostRef.key,
    text: text,
    comment_count: 0,
    post_img: postImgUrl,
    timestamp: new Date().getTime(),
    view_count: 0
  }
  return post
}

/**
 * Broadcasts post to the poster's followers
 * and adds the post to the user's list of posts.
 *
 * Returns post after succesful upload.
 */
submitPost = async post => {
  updatePostsForFollowers(post)
  const postSnap = await addOrUpdatePost(post)
  return post
}

/**
 * Uploads an image for a post and returns the URL
 */
uploadImageForPost = async (postImgUri, authorId) => {
  return await uploadImage(postImgUri, authorId, postImageUploadPath)
}

/**
 * Adds or updates post to user's list of posts to be shown
 * on profile view.
 */
addOrUpdatePost = post => {
  return postsRef
    .child(post.author_id)
    .child(post.key)
    .update(post)
}

/**
 * Adds or updates a post to all of a user's followers.
 *
 * Also, early on we want to show every user every post and
 * so we do so here.
 */
updatePostsForFollowers = async post => {
  // This is only going to be used early on, as we want to
  // show every post to every user.
  const globalFeedPostSnap = await postToGlobalFeed(post)

  const followers = await getFollowersForUser(post.author_id)
  const fanoutObj = fanoutPost(followers, post)
  return rootRef.update(fanoutObj)
}

/**
 * Only used in early app development process. To be removed.
 *
 * Adds post to global feed.
 */
postToGlobalFeed = async post => {
  return await globalFeedRef.child(post.key).set(post)
}

/**
 * Returns array of posts made by user.
 *
 * Currently used on ProfileScreen view.
 */
getPosts = async userId => {
  const postsSnap = await postsRef.child(userId).once("value")
  return Object.values(postsSnap.val())
}

/**
 * Get posts a user has liked
 */
// TODO

/**
 * Creates an object to update all posts on Firebase for all followers.
 * @param {array} followers
 * @param {post} post
 */
function fanoutPost(followers, post) {
  var fanoutObj = {}
  // write to each follower's timeline
  followers.forEach(
    userId => (fanoutObj["/feed/" + userId + "/" + post.key] = post)
  )
  return fanoutObj
}

export { createPost, submitPost }
