import { getFollowersForUser } from '../Users'
import {rootRef, postsRef, uploadImage, postImageUploadPath } from '../../Utils/FirebaseUtils'

/**
 * Utility method for creating a post. Also uploads image for post
 */
createPost = async (
    authorUsername, authorImgUrl, authorId, 
    key, 
    imageUri, text) => {
        // First, I need to upload the image
        const postImgUrl = await uploadImageForPost(imageUri, authorId)
        // Create a reference to where the post is going in order to get a key
        const newPostRef = postsRef.child(authorId).push()
        // Create the post object
        const post = {
            author_username: authorUsername,
            author_img_url: authorImgUrl,
            author_id: authorId,
            key: newPostRef.key,
            text: text,
            comment_count: 0,
            post_img: postImgUrl,
            timestamp: new Date().getTime(),
            view_count: 0
        }
        return post;
    }

/**
 * Broadcasts post to the poster's followers
 * and adds the post to the user's list of posts.
 */
submitPost = async post => {
    updatePostsForFollowers(post)
    return await addOrUpdatePost(post)
}

/**
 * Uploads an image for a post and returns the URL
 */
uploadImageForPost = async (postImgUri, authorId) => {
    const downloadSnap = await uploadImage(
        postImgUri, 
        authorId, 
        postImageUploadPath)

    return downloadSnap.downloadURL
}

addOrUpdatePost = post => {
    return postsRef.child(post.author_id).child(post.key).update(post)
}

updatePostsForFollowers = (post) => {
    const followers = await getFollowersForUser(post.author_id)
    const fanoutObj = fanoutPost(followers, post)
    return rootRef.transaction(fanoutObj)
}

/**
 * Returns array of posts made by user.
 */
getPosts = async userId => {
    const postsSnap = await postsRef.child(userId).once('value')
    return Object.values(postsSnap.val())
}

/**
 * Get posts a user has liked
 */
// TODO

function fanoutPost( followers, post ) {
  var fanoutObj = {}
  // write to each follower's timeline
  followers.forEach(
    userId => (fanoutObj['/feed/' + userId + '/' + post.key] = post)
  )
  return fanoutObj
}
