export default post => ({
  ...post,
  liked: post.likes.includes(global.user.uid),
  disliked: (post.likes || []).includes(global.user.uid),
  dislikes: null,
  likes: null
})
