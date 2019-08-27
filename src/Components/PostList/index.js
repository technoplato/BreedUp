import React from "react"
import { ListView, Share, RefreshControl } from "react-native"
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import axios from "axios"
import _ from "lodash"

import FeedCard from "../FeedCard"

export default class PostList extends React.Component {
  componentWillMount() {
    const rootRef = firebase.database().ref()

    this.likedPostsRef = rootRef.child("users/" + this.userId + "/likes")
    this.postsRef = rootRef.child("posts/" + this.props.userId)

    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        return r1.key !== r2.key || r1.liked !== r2.liked
      },
      getRowData: (dataBlog, sectionId, rowId) => {
        const post = dataBlog.s1[rowId]
        post.liked = this.state.likedPosts.get(post.key) || false
        return post
      }
    })

    this.setState({
      ...this.state,
      refreshing: true,
      likedPosts: new Map(),
      posts: [],
      postsDataSource: this.ds.cloneWithRows([])
    })

    this.loadPosts()
  }

  loadPosts = () => {
    let likedKeys
    // First, we need to get an array of liked posts from the user
    return this.likedPostsRef
      .once("value", snapshot => {
        // The existence of a key here constitues a like. The value is unused.
        return Object.keys(snapshot.val() || {})
      })
      .then(snapshot => {
        likedKeys = Object.keys(snapshot.val() || {})

        return this.getAllChildrenPromise(this.postsRef)
      })
      .then(posts => {
        const likedPosts = new Map(likedKeys.map(key => [key, true]))

        const orderedPosts = _.sortBy(posts, ["key"]).reverse()

        this.setState({
          ...this.state,
          refreshing: false,
          likedPosts: likedPosts,
          posts: orderedPosts,
          postsDataSource: this.ds.cloneWithRows(orderedPosts)
        })

        // Need to return something here to ensure everything is loaded before
        // adding another task that consumes memory
        return true
      })
  }

  renderItem = item => {
    if (item !== undefined) {
      return (
        <FeedCard
          liked={!!this.state.likedPosts.get(item.key)}
          onLikePressed={this.onLikePressed}
          onCommentPressed={this.onCommentPressed}
          onSharePressed={this.onSharePressed}
          onAvatarPressed={this.props.onAvatarPressed}
          item={item}
        />
      )
    } else {
      return null
    }
  }

  renderList = () => {
    return (
      <ListView
        enableEmptySections={true}
        refreshControl={
          <RefreshControl
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
        dataSource={this.state.postsDataSource}
        renderRow={this.renderItem}
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
    const newDs = this.state.postsDataSource._dataBlob.s1
    const index = this.indexWithKey(newDs, key)
    const post = newDs[index]
    post["liked"] = !wasLiked
    newDs[index] = post

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

    this.setState({
      postsDataSource: this.ds.cloneWithRows(newDs)
    })
  }

  indexWithKey(arr, key) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].key === key) {
        return i
      }
    }
    return -1
  }

  onCommentPressed = post => {
    this.props.navigation.navigate("Comments", {
      post: post
    })
  }

  onSharePressed = (key, text) => {
    const url =
      /* TODO: Proper link on iOS and Android to download link (with deep link for extra points) */ "https://github.com/lustigdev/BreedUp/issues/37"
    Share.share({
      title: "Breed Up is awesome!",
      message: `Breed Up is awesome. Download it now! Check out this post.\n\n${text}\n\n${url}`
    })
  }

  getAllChildrenPromise(listRef, debug = false) {
    const keysLink = listRef.toString() + ".json?shallow=true"

    return axios.get(keysLink).then(res => {
      if (res.data) {
        const keys = Object.keys(res.data)
        const promises = []

        keys.forEach(key => {
          promises.push(
            listRef
              .child(key)
              .once("value")
              .then(snap => {
                return snap.val()
              })
          )
        })

        return Promise.all(promises)
      } else {
        return Promise.resolve([])
      }
    })
  }
}
