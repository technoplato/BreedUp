export default post => ({
  ...post,
  liked: post.likes.includes(
    global.user ? global.user.uid : 'r40337XTxTMxRdXtcoNfbeHuOnu2'
  ),
  disliked: (post.dislikes || []).includes(
    global.user ? global.user.uid : 'r40337XTxTMxRdXtcoNfbeHuOnu2'
  ),
  dislikes: null,
  likes: null
})
