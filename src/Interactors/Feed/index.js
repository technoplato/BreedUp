/**
 * Holds the interactors (use-cases, whatever you'd like to call them)
 * for the Feed. In the context of the application, a Feed is a list
 * of Posts.
 *
 * I distinguised Feed from 'Posts' because they are contextually two
 * different things. Feeds are what a user views when looking at the
 * list of posts made by people they follow. Posts are more closely
 * associated with an individual user, and their Posts can be seen
 * on their profile.
 */

/**
 * Adds post to particular user's feed
 */
addPostToFeed = (post, userIdForFeed) => {
  return feedRef
    .child(userIdForFeed)
    .child(post.key)
    .set(post)
}

/**
 * Gets feed for particular user
 */
getFeed = async userId => {
  const feed = await feedRef.child(userId).once("value")
  return {
    feed: Object.values(feed.val() || {})
  }
}
