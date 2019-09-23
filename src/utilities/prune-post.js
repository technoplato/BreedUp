export default post => ({
  ...post,
  liked: post.likes.includes(global.user.uid),
  likes: null
})
