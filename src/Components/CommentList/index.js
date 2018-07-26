import React from 'react'
import { FlatList, ActivityIndicator } from 'react-native'
import firebase from 'react-native-firebase'

import CommentListItem from '../CommentListItem'
import styles from './CommentListStyles'
import { Colors, Metrics } from '../../Themes'

export default class CommentsList extends React.Component {
  constructor(props) {
    super(props)

    const rootRef = firebase.database().ref()
    this.commentsRef = rootRef.child(`posts/${this.props.postKey}/comments`)

    this.state = {
      loading: false,
      comments: []
    }

    this.loadComments()
  }

  loadComments = () => {
    this.commentsRef.on('child_added', snap => {
      const comments = this.state.comments
      comments.push(snap.val())
      this.setState({ comments: comments, loading: false })
    })
  }

  renderItem = ({ item }) => {
    return <CommentListItem item={item} />
  }

  renderList = () => {
    return (
      <FlatList
        style={{
          maxHeight: '80%',
          width: '70%'
        }}
        data={this.state.comments}
        renderItem={this.renderItem}
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

  keyExtractor = item => item.key
}
