import React from 'react'
import { FlatList, Share, RefreshControl } from 'react-native'
import firebase from 'react-native-firebase'

import FeedCard from '../FeedCard'
import styles from './FeedListStyles'

export default class FeedList extends React.Component {
  componentWillMount() {
    const { currentUser } = firebase.auth()

    const rootRef = firebase.database().ref()

    this.currentUser = currentUser
    this.uid = currentUser.uid
    this.likedPostsRef = rootRef.child('users/' + this.uid + '/likes')
    this.postsRef = rootRef.child('posts/')

    this.setState({
      ...this.state,
      refreshing: true,
      likedPosts: new Map(),
      posts: []
    })

    this.loadPosts().then(() => {
      this.updateViewCounts()
    })
  }

  loadPosts = () => {
    let likedKeys
    // First, we need to get an array of liked posts from the user
    return this.likedPostsRef
      .once('value', snapshot => {
        // The existence of a key here constitues a like. The value is unused.
        return Object.keys(snapshot.val() || {})
      })
      .then(snapshot => {
        likedKeys = Object.keys(snapshot.val() || {})
        return this.postsRef.once('value', snap => {
          return snap.val()
        })
      })
      .then(postsSnap => {
        const posts = []
        postsSnap.forEach(postSnap => {
          posts.unshift(postSnap.val())
        })

        const likedPosts = new Map(likedKeys.map(key => [key, true]))

        this.setState({
          ...this.state,
          refreshing: false,
          likedPosts: likedPosts,
          posts: posts
        })

        // Need to return something here to ensure everything is loaded before
        // adding another task that consumes memory
        return true
      })
  }

  updateViewCounts = () => {
    this.state.posts.forEach(post => {
      this.postsRef
        .child(post.key)
        .child('view_count')
        .transaction(
          current => {
            return (current || 0) + 1
          },
          (error, committed, snapshot) => {
            // Optionally handle results here
          }
        )
    })
  }

  renderItem = ({ item }) => {
    return (
      <FeedCard
        liked={!!this.state.likedPosts.get(item.key)}
        onLikePressed={this.onLikePressed}
        onCommentPressed={this.onCommentPressed}
        onSharePressed={this.onSharePressed}
        item={item}
      />
    )
  }

  renderList = () => {
    return (
      <FlatList
        refreshControl={
          <RefreshControl
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
        data={this.state.posts}
        renderItem={this.renderItem}
        extraData={this.state}
        keyExtractor={this.keyExtractor}
      />
    )
  }

  onRefresh = () => {
    this.setState({ refreshing: true })
    this.loadPosts().then(() => {
      this.setState({ refreshing: false })
    })
  }

  render() {
    return this.renderList()
  }

  keyExtractor = item => {
    return item.key
  }

  /****************************************************************************
   ****************************** Interactions ********************************
   ***************************************************************************/
  onLikePressed = (key, wasLiked) => {
    handleLikeToggle = wasLiked
      ? this.likedPostsRef.child(key).remove()
      : this.likedPostsRef.child(key).set(!wasLiked)

    handleLikeToggle.then(() => {
      this.setState(state => {
        const likedPosts = new Map(state.likedPosts)
        likedPosts.set(key, !wasLiked)
        return { likedPosts }
      })
    })
  }

  onCommentPressed = key => {
    this.props.navigation.navigate('Comments', {
      key: key,
      postAuthor: this.currentUser.displayName
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
