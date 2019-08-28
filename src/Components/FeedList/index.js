import React from 'react'
import { ListView, Share, RefreshControl } from 'react-native'

import firebase from '@react-native-firebase/app'
import '@react-native-firebase/database'
import '@react-native-firebase/auth'

import FeedCard from '../FeedCard'
import styles from './FeedListStyles'
import { Text } from 'react-native-elements'

export default class FeedList extends React.Component {
  // componentWillMount() {
  //   const { currentUser } = firebase.auth()
  //
  //   const rootRef = firebase.database().ref()
  //
  //   this.currentUser = currentUser
  //   this.uid = currentUser.uid
  //   this.likedPostsRef = rootRef.child('users/' + this.uid + '/likes')
  //   this.feedRef = rootRef.child('all_posts/')

  // this.ds = new ListView.DataSource({
  //   rowHasChanged: (r1, r2) => {
  //     return (
  //       r1.key !== r2.key ||
  //       r1.liked !== r2.liked ||
  //       r1.comment_count !== r2.comment_count
  //     )
  //   },
  //   getRowData: (dataBlog, sectionId, rowId) => {
  //     const post = dataBlog.s1[rowId]
  //     post.liked = this.state.likedPosts.get(post.key) || false
  //     return post
  //   }
  // })

  // this.setState({
  //   ...this.state,
  //   refreshing: true,
  //   likedPosts: new Map(),
  //   posts: [],
  //   postsDataSource: this.ds.cloneWithRows([])
  // })

  // this.loadPosts().then(() => {
  //   this.updateViewCounts()
  // })
  // }

  // loadPosts = () => {
  //   let likedKeys
  //   // First, we need to get an array of liked posts from the user
  //   return this.likedPostsRef
  //     .once("value", snapshot => {
  //       // The existence of a key here constitues a like. The value is unused.
  //       return Object.keys(snapshot.val() || {})
  //     })
  //     .then(snapshot => {
  //       likedKeys = Object.keys(snapshot.val() || {})
  //       return this.feedRef.once("value", snap => {
  //         return snap.val()
  //       })
  //     })
  //     .then(postsSnap => {
  //       const posts = []
  //       postsSnap.forEach(postSnap => {
  //         posts.unshift(postSnap.val())
  //       })
  //
  //       const likedPosts = new Map(likedKeys.map(key => [key, true]))
  //
  //       this.setState({
  //         ...this.state,
  //         refreshing: false,
  //         likedPosts: likedPosts,
  //         posts: posts,
  //         postsDataSource: this.ds.cloneWithRows(posts)
  //       })
  //
  //       // Need to return something here to ensure everything is loaded before
  //       // adding another task that consumes memory
  //       return true
  //     })
  // }

  updateViewCounts = () => {
    this.state.posts.forEach(post => {
      this.feedRef
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

  // renderItem = item => {
  //   if (item !== undefined) {
  //     return (
  //       <FeedCard
  //         liked={!!this.state.likedPosts.get(item.key)}
  //         onLikePressed={this.onLikePressed}
  //         onCommentPressed={this.onCommentPressed}
  //         onSharePressed={this.onSharePressed}
  //         onAvatarPressed={this.onAvatarPressed}
  //         item={item}
  //       />
  //     )
  //   } else {
  //     return null
  //   }
  // }

  // renderList = () => {
  //   return (
  //     <ListView
  //       enableEmptySections={true}
  //       refreshControl={
  //         <RefreshControl
  //           style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
  //           refreshing={this.state.refreshing}
  //           onRefresh={this.onRefresh}
  //         />
  //       }
  //       dataSource={this.state.postsDataSource}
  //       renderRow={this.renderItem}
  //       keyExtractor={this.keyExtractor}
  //     />
  //   )
  // }

  onRefresh = () => {
    this.setState({ refreshing: true })
    this.loadPosts().then(() => {
      this.setState({ refreshing: false })
    })
  }

  render() {
    // return this.renderList()
    return <Text style={{ fontSize: 50 }}>"Under construction"</Text>
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
    post['liked'] = !wasLiked
    newDs[index] = post

    const handleLikeToggle = wasLiked
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
    this.props.navigation.navigate('Comments', {
      post: post
    })
  }

  onAvatarPressed = (userId, username) => {
    this.props.navigation.navigate('PublicProfile', {
      userId: userId,
      username: username
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
