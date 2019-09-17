import React from 'react'
import { FlatList, ActivityIndicator } from 'react-native'
import { filter, map } from 'rxjs/operators'
import _ from 'lodash'

import CommentListItem from '../CommentListItem'
import styles from './CommentListStyles'
import { Colors } from '../../Themes'

import {
  fetchCommentsForPost,
  stopObservingCommentsForPost,
  observeCommentsForPost
} from '../../Interactors/Comments'

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
    fetchCommentsForPost(post.id, comments => {
      this.setState({ loading: false, comments })
    })

    // console.log(fetchedComments)

    // TODO this behavior needs to change
    // observeCommentsForPost(post.id)
    //   .pipe(
    //     filter(comment => {
    //       const { comments } = this.state
    //       let newComment = true
    //       for (let i = 0; i < comments.length; i++) {
    //         if (comments[i].id === comment.id) {
    //           newComment = false
    //           break
    //         }
    //       }
    //
    //       return newComment
    //     })
    //   )
    //   .subscribe(comment => {
    //     this.addCommentToList(comment)
    //   })
  }

  addCommentToList = comment => {
    const comments = this.state.comments
    comments.push(comment)
    this.setState({ comments: _.uniq(comments) })
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
    stopObservingCommentsForPost(this.props.post.id)
  }
}
