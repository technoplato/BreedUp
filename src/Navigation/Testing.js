import React from 'react'
import { Button, FlatList, TouchableOpacity, Text, View } from 'react-native'
import firestore from '@react-native-firebase/firestore'

class MyListItem extends React.Component {
  _onPress = () => {
    this.props.onPressLike(this.props.id, this.props.liked)
  }

  render() {
    console.log('Rendering', this.props.id)
    const textColor = this.props.liked ? 'blue' : 'pink'
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View>
          <Text style={{ color: textColor, fontSize: 22 }}>
            {this.props.id}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  shouldComponentUpdate(
    { liked },
    nextState: Readonly<S>,
    nextContext: any
  ): boolean {
    return liked !== this.props.liked
  }
}

class PostsList extends React.PureComponent {
  state = { posts: [], likes: (new Map(): Map<string, boolean>) }

  async componentDidMount(): void {
    this.postsRef = firestore().collection('posts')
    this.postsRef.get().then(this.onPostsLoaded)
  }

  onPostsLoaded = postsCollection => {
    const likePostIds = []
    const posts = []
    postsCollection.forEach(postDoc => {
      const post = postDoc.data()
      if (post.likes && post.likes.includes(this.props.userId)) {
        likePostIds.push(postDoc.id)
      }
      posts.push(post)
    })

    const likesMap = new Map(this.state.likes)
    likePostIds.forEach(postId => likesMap.set(postId, !likesMap.get(postId)))

    this.setState({ posts, likes: likesMap })
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
      const likes = new Map(state.likes)
      likes.set(postId, isLiked)
      return { likes }
    })
  }

  setRemotePostLikeStatus = async (postId, isLiked) => {
    return isLiked
      ? await this.setPostAsLiked(postId)
      : await this.setPostAsDisliked(postId)
  }

  setPostAsLiked = async postId => {
    try {
      await this.postsRef.doc(postId).update({
        likes: firestore.FieldValue.arrayUnion(this.props.userId),
        likeCount: firestore.FieldValue.increment(1)
      })
      return true
    } catch (e) {
      return false
    }
  }

  setPostAsDisliked = async postId => {
    try {
      await this.postsRef.doc(postId).update({
        likes: firestore.FieldValue.arrayRemove(this.props.userId),
        likeCount: firestore.FieldValue.increment(-1)
      })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  _renderItem = ({ item }) => (
    <MyListItem
      id={item.id}
      onPressLike={this.handleLikePressed}
      liked={!!this.state.likes.get(item.id)}
      title={item.title}
    />
  )

  render() {
    return (
      <FlatList
        data={this.state.posts}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    )
  }
  _keyExtractor = item => item.id
}

export default class Testing extends React.Component {
  async componentDidMount() {}

  render() {
    return (
      <View style={{ paddingTop: 100 }}>
        <PostsList userId={'123'} />
      </View>
    )
  }
}
