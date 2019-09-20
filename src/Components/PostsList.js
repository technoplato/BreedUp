import React from 'react'
import { View, FlatList, Share } from 'react-native'
import firestore from '@react-native-firebase/firestore'

import PostItem from './PostItem'
import EmptyPosts from './EmptyPosts'
import ShowNewPostsButton from './ShowNewPostsButton'
import isEmpty from 'utilities/is-empty'

export default class PostsList extends React.PureComponent {
  PAGE_SIZE = 10

  constructor(props) {
    super(props)

    const { userId } = props

    // Staged posts are posts that have been added remotely but not shown yet.
    this.state = { posts: {}, staged: {} }
    this.list = React.createRef()

    this.postsRef = firestore().collection('posts')
    if (userId) {
      this.postsRef = firestore()
        .collection('posts')
        .where('author.uid', '==', userId)
    }

    this.next = this.postsRef.orderBy('created', 'desc').limit(this.PAGE_SIZE)
    this.changesUnsubscribe = () => {}
    this.loadMorePosts()
  }

  loadMorePosts = async () => {
    if (this.state.noOlderPostsAvailable) return
    this.changesUnsubscribe()

    const newPosts = await this.next.get().then(this.parsePostsSnapshot)
    const numNewPosts = newPosts.length
    const noOlderPostsAvailable = numNewPosts < this.PAGE_SIZE
    const posts = { ...this.state.posts }
    newPosts.forEach(post => (posts[post.id] = post))

    let oldestPostTime =
      numNewPosts === 0
        ? new Date().getTime()
        : newPosts[numNewPosts - 1].created

    this.next = firestore()
      .collection('posts')
      .orderBy('created', 'desc')
      .startAt(oldestPostTime)
      .limit(this.PAGE_SIZE)

    await new Promise(res =>
      this.setState({ posts, noOlderPostsAvailable }, () => res())
    )

    this.changesUnsubscribe = firestore()
      .collection('posts')
      .orderBy('created', 'desc')
      .endAt(oldestPostTime)
      .onSnapshot(this.onPostsUpdated)
  }

  componentWillUnmount() {
    this.changesUnsubscribe()
  }

  parsePostsSnapshot = collection => {
    const numPosts = collection.size
    if (numPosts === 0) {
      console.log(
        "0 docs fetched, `parsePostsSnapshot` shouldn't have been called."
      )
      return []
    } else if (numPosts < this.PAGE_SIZE) {
      console.log('No older posts exist. Only listen for new posts now.')
    }

    return collection.docs.map(doc => this.prunePost(doc.data()))
  }

  onPostsUpdated = postsCollection => {
    let doScrollToTop = false
    const posts = { ...this.state.posts }
    postsCollection.docChanges().forEach(({ type, doc }) => {
      const post = doc.data()
      if (type === 'added') {
        if (!posts[post.id]) {
          if (post.author.uid === global.user.uid) {
            posts[post.id] = this.prunePost(post)
            doScrollToTop = true
          } else {
            this.stagePost(post)
          }
        }
      }
      if (type === 'modified') {
        posts[post.id] = this.prunePost(post)
      }
      if (type === 'removed') {
        delete posts[post.id]
      }
    })

    this.setState({ posts }, () => {
      if (doScrollToTop) this.scrollToTop()
    })
  }

  scrollToTop = () => {
    setTimeout(() => {
      this.list.scrollToOffset({ animated: false, offset: 0 })
    }, 200)
  }

  prunePost = post => ({
    ...post,
    liked: post.likes.includes(this.props.userId),
    likes: null
  })

  stagePost = post => {
    const staged = { ...this.state.staged }
    staged[post.id] = this.prunePost(post)
    this.setState({ staged })
  }

  handleLikePressed = async (postId, wasLiked) => {
    // Optimistic update
    this.setLocalPostLikeStatus(postId, !wasLiked)
    const updateSucceeded = await this.setRemotePostLikeStatus(
      postId,
      !wasLiked
    )

    // Revert to previous like state if update fails
    if (!updateSucceeded) {
      this.setLocalPostLikeStatus(postId, wasLiked)
    }
  }

  setLocalPostLikeStatus = (postId, isLiked) => {
    this.setState(state => {
      const posts = { ...state.posts }
      posts[postId].liked = isLiked
      return { posts }
    })
  }

  setRemotePostLikeStatus = async (postId, isLiked) => {
    const likes = isLiked
      ? firestore.FieldValue.arrayUnion(this.props.userId)
      : firestore.FieldValue.arrayRemove(this.props.userId)
    const likeCount = firestore.FieldValue.increment(isLiked ? 1 : -1)
    try {
      await this.postsRef.doc(postId).update({
        likes,
        likeCount
      })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  _renderItem = ({ item }) => (
    <PostItem
      item={item}
      id={item.id}
      onPressLike={this.handleLikePressed}
      liked={item.liked}
      title={item.title}
      likeCount={item.likeCount}
      viewCount={item.viewCount}
      navigation={this.props.navigation}
      onAvatarPressed={this.onAvatarPressed}
      onCommentPressed={this.onCommentPressed}
      onSharePressed={this.onSharePressed}
    />
  )

  render() {
    const { staged, posts } = this.state

    return (
      <View style={{ flex: 1 }}>
        <ShowNewPostsButton staged={staged} onPress={this.showNewPosts} />
        <EmptyPosts
          userId={this.props.userId}
          posts={posts}
          navigation={this.props.navigation}
        />
        <FlatList
          viewabilityConfig={{
            itemVisiblePercentThreshold: 100,
            minimumViewTime: 3000
          }}
          ref={ref => {
            this.list = ref
          }}
          onViewableItemsChanged={this.onViewableItemsChanged}
          maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
          data={this.data()}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          onEndReachedThreshold={2}
          onEndReached={this.onEndReached}
          initialNumToRender={3}
        />
      </View>
    )
  }

  data = () => {
    return Object.values(this.state.posts).sort((p1, p2) =>
      p1.created <= p2.created ? 1 : -1
    )
  }

  onViewableItemsChanged = info => {
    info.changed
      .filter(item => item.isViewable)
      .forEach(({ item }) => {
        firestore()
          .collection('posts')
          .doc(item.id)
          .update({ viewCount: firestore.FieldValue.increment(1) })
      })
  }

  onEndReached = distance => {
    this.loadMorePosts()
  }

  showNewPosts = () => {
    const { posts, staged } = this.state
    const withNewPosts = { ...posts, ...staged }
    this.setState({ posts: withNewPosts, staged: {} })
  }

  _keyExtractor = item => item.id

  onCommentPressed = post => {
    this.props.navigation.navigate('Comments', {
      post: post
    })
  }

  onAvatarPressed = user => {
    this.props.navigation.navigate('PublicProfile', {
      userId: user.uid,
      username: user.username
    })
  }

  onSharePressed = (key, text) => {
    const url =
      /* TODO: Proper link on iOS and Android to download link (with deep link for extra points) */ 'https://github.com/lustigdev/BreedUp/issues/37'
    Share.share({
      title: 'Breed Up is awesome!',
      message: `Breed Up is awesome. Download it now! Check out this post.\n\n${text}\n\n${url}`
    })
  }
}
