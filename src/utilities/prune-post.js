export default post => ({
  ...post,
  liked: post.likes.includes(global.user.uid),
  disliked: (post.dislikes || []).includes(global.user.uid),
  dislikes: null,
  likes: null
})
