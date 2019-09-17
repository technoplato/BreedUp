import React from 'react'
import { FlatList, ActivityIndicator } from 'react-native'
import CommentListItem from '../CommentListItem'
import styles from './CommentListStyles'
import { Colors } from '../../Themes'

import { observeCommentsForPost } from '../../Interactors/Comments'

export default class CommentsList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      comments: []
    }

    this.loadComments()
  }

  loadComments = async () => {
    const { post } = this.props
    this.unsubscribe = observeCommentsForPost(post.id, comments => {
      this.setState({ loading: false, comments })
    })
  }

  renderItem = ({ item }) => {
    return <CommentListItem item={item} />
  }

  renderList = () => {
    return (
      <FlatList
        inverted
        vertical
        showsVerticalScrollIndicator={false}
        style={styles.list}
        data={this.state.comments}
        extraData={this.state}
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

  keyExtractor = item => item.id

  componentWillUnmount() {
    this.unsubscribe()
  }
}
