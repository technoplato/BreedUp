import React from 'react'
import { Button, FlatList, TouchableOpacity, Text, View } from 'react-native'
import firestore from '@react-native-firebase/firestore'

class PostItem extends React.Component {
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
          <Text style={{ fontSize: 16 }}>{this.props.likeCount}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  shouldComponentUpdate({ liked, likeCount }): boolean {
    return liked !== this.props.liked || likeCount !== this.props.likeCount
  }
}

class PostsList extends React.PureComponent {
  state = { posts: {} }

  async componentDidMount() {
    this.postsRef = firestore().collection('posts')
    this.postsRef.onSnapshot(this.onPostsUpdated)
  }

  onPostsUpdated = postsCollection => {
    const posts = {}
    postsCollection.forEach(postDoc => {
      const post = postDoc.data()
      posts[post.id] = {
        ...post,
        liked: post.likes && post.likes.includes(this.props.userId),
        likes: null
      }
    })

    this.setState({ posts })
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
    return isLiked
      ? await this.setPostAsLiked(postId)
      : await this.setPostAsUnliked(postId)
  }

  setPostAsLiked = async postId => {
    try {
      await this.postsRef.doc(postId).update({
        likes: firestore.FieldValue.arrayUnion(this.props.userId),
        likeCount: firestore.FieldValue.increment(1)
      })
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  setPostAsUnliked = async postId => {
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
    <PostItem
      id={item.id}
      onPressLike={this.handleLikePressed}
      liked={item.liked}
      title={item.title}
    />
  )

  render() {
    console.log('Rendering PostsList')
    return (
      <FlatList
        data={Object.values(this.state.posts)}
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
