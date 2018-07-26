import React from 'react'
import { FlatList, ActivityIndicator } from 'react-native'
import firebase from 'react-native-firebase'

import FeedCard from '../FeedCard'
import styles from './FeedListStyles'
import { Colors } from '../../Themes'

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
      loading: true,
      likedPosts: new Map(),
      posts: []
    })

    this.loadPosts()
  }

  loadPosts = () => {
    let likedKeys
    // First, we need to get an array of liked posts from the user
    this.likedPostsRef
      .once('value', snapshot => {
        // The existence of a key here constitues a like. The value is unused.
        return Object.keys(snapshot.val())
      })
      .then(snapshot => {
        likedKeys = Object.keys(snapshot.val())
        return this.postsRef
          .orderByChild('reverse_timestamp')
          .once('value', snap => {
            return snap.val()
          })
      })
      .then(postsSnap => {
        const posts = Object.values(postsSnap.val())

        const likedPosts = new Map(likedKeys.map(key => [key, true]))

        this.setState({
          ...this.state,
          loading: false,
          likedPosts: likedPosts,
          posts: posts
        })
      })
  }

  renderItem = ({ item }) => {
    return (
      <FeedCard
        liked={!!this.state.likedPosts.get(item.key)}
        onLikePressed={this.onLikePressed}
        onCommentPressed={this.onCommentPressed}
        item={item}
      />
    )
  }

  renderList = () => {
    return (
      <FlatList
        data={this.state.posts}
        renderItem={this.renderItem}
        extraData={this.state}
        keyExtractor={this.keyExtractor}
      />
    )
  }

  renderLoading = () => {
    return (
      <ActivityIndicator
        style={styles.loading}
        size="large"
        color={Colors.crimson}
      />
    )
  }

  render() {
    return this.state.loading ? this.renderLoading() : this.renderList()
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
}
