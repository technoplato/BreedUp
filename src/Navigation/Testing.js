import React from 'react'
import { Button, FlatList, TouchableOpacity, Text, View } from 'react-native'
import firestore from '@react-native-firebase/firestore'

import empty from '../utilities/is-empty'

class PostsList extends React.PureComponent {
  // Staged posts are posts that have been added remotely but not shown yet.
  state = { posts: {}, staged: {} }

  PAGE_SIZE = 10

  async componentDidMount() {
    this.postsRef = firestore().collection('posts')
    this.oldestPostTime = new Date().getTime()
    this.next = this.postsRef.orderBy('created', 'desc').limit(this.PAGE_SIZE)
    this.changesUnsubscribe = () =>
      console.log(
        'This method will be used to unsubscribe our listener when we fetch older posts.'
      )
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

    this.oldestPostTime = newPosts[numNewPosts - 1].created
    this.next = firestore()
      .collection('posts')
      .orderBy('created', 'desc')
      .startAt(this.oldestPostTime)
      .limit(this.PAGE_SIZE)

    await new Promise(res =>
      this.setState({ posts, noOlderPostsAvailable }, () => res())
    )

    this.changesUnsubscribe = firestore()
      .collection('posts')
      .orderBy('created', 'desc')
      .endAt(this.oldestPostTime)
      .onSnapshot(this.onPostsUpdated)
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
    const posts = { ...this.state.posts }
    postsCollection.docChanges().forEach(({ type, doc }) => {
      const post = doc.data()
      if (type === 'added') {
        if (!posts[post.id]) {
          // If the post is already present, do not add it again.
          // Firestore snapshot does not have simple functionality to only
          // listen to changes on windows of data.
          this.stagePost(post)
        }
      }
      if (type === 'modified') {
        posts[post.id] = this.prunePost(post)
      }
      if (type === 'removed') {
        delete posts[post.id]
      }
    })

    this.setState({ posts })
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
      id={item.id}
      onPressLike={this.handleLikePressed}
      liked={item.liked}
      title={item.title}
      likeCount={item.likeCount}
      viewCount={item.viewCount}
    />
  )

  render() {
    const { staged } = this.state
    return (
      <View>
        <ShowNewPostsButton staged={staged} onPress={this.showNewPosts} />
        <FlatList
          viewabilityConfig={{
            itemVisiblePercentThreshold: 100,
            minimumViewTime: 3000
          }}
          onViewableItemsChanged={this.onViewableItemsChanged}
          contentContainerStyle={{ paddingBottom: 200 }}
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
}

export default class Testing extends React.Component {
  render() {
    return (
      <View style={{ paddingTop: 100 }}>
        <Button
          title={'Delete Posts'}
          onPress={() => {
            firestore()
              .collection('posts')
              .get()
              .then(snap =>
                snap.forEach(doc => {
                  doc.ref.delete()
                })
              )

            firestore()
              .collection('meta')
              .doc('foo')
              .set({ count: 0 })
          }}
        />
        {/*<Button*/}
        {/*  title={'Add a bunch of posts'}*/}
        {/*  onPress={async () => {*/}
        {/*    const NUMBER = 20*/}
        {/*    const countDoc = await firestore()*/}
        {/*      .collection('meta')*/}
        {/*      .doc('foo')*/}
        {/*      .get()*/}
        {/*    const count = countDoc.exists ? countDoc.data().count : 0*/}
        {/*    console.log(count)*/}

        {/*    for (let i = count; i < count + NUMBER; i++) {*/}
        {/*      const doc = firestore()*/}
        {/*        .collection('posts')*/}
        {/*        .doc()*/}
        {/*      await doc.set({*/}
        {/*        title: i + '',*/}
        {/*        id: doc.id*/}
        {/*      })*/}
        {/*    }*/}

        {/*    countDoc.ref.update({*/}
        {/*      count: firestore.FieldValue.increment(NUMBER)*/}
        {/*    })*/}
        {/*  }}*/}
        {/*/>*/}
        <PostsList userId={'123'} />
      </View>
    )
  }
}

class PostItem extends React.Component {
  _onPress = () => {
    this.props.onPressLike(this.props.id, this.props.liked)
  }

  render() {
    const textColor = this.props.liked ? 'blue' : 'red'
    return (
      <TouchableOpacity
        style={{ backgroundColor: 'yellow', height: 300, marginVertical: 20 }}
        onPress={this._onPress}
      >
        <View>
          <Text style={{ color: textColor, fontSize: 22 }}>
            {this.props.title}
          </Text>
          <Text style={{ fontSize: 16 }}>
            {'Likes: ' + this.props.likeCount + ''}
          </Text>

          <Text style={{ fontSize: 16 }}>
            {'Views: ' + this.props.viewCount + ''}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  shouldComponentUpdate({ liked, likeCount, viewCount }) {
    return (
      liked !== this.props.liked ||
      likeCount !== this.props.likeCount ||
      viewCount !== this.props.viewCount
    )
  }
}

const ShowNewPostsButton = ({ staged, onPress }) => {
  if (empty(staged)) return null
  const stagedCount = Object.keys(staged).length

  return (
    <Button
      title={`Show ${stagedCount} New Post${stagedCount === 1 ? '' : 's'}`}
      onPress={onPress}
    />
  )
}
