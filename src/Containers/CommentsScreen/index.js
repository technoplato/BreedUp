import React from 'react'
import { TextInput, KeyboardAvoidingView, Keyboard } from 'react-native'
import { Button } from 'react-native-elements'

import CommentList from '../../Components/CommentList'
import styles from './CommentsScreenStyles'
import { addComment } from '../../Interactors/Comments'

export default class CommentsScreen extends React.Component {
  constructor(props) {
    super(props)

    const postId = this.props.navigation.getParam('key', 'NO-ID')

    this.state = { postId: postId, comment: '' }

    this.onSubmitEditing = this.onSubmitEditing.bind(this)
  }

  onPressAddComment = () => {
    Keyboard.dismiss()

    this.setState({ comment: '' })

    addComment(this.state.postId, this.state.comment)
  }

  onChangeText = text => {
    this.setState({ comment: text })
  }

  render() {
    return <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <CommentList postId={this.state.postId} />
        <TextInput style={styles.input} value={this.state.comment.toString()} onChangeText={comment => this.onChangeText(comment)} onSubmitEditing={this.onSubmitEditing} placeholder="Enter comment" />
        <Button height={42} title="Add Comment" onPress={this.onPressAddComment} />
      </KeyboardAvoidingView>
  }

  onSubmitEditing() {
    Keyboard.dismiss
    const { comment } = this.state
    this.setState({ comment: comment.trim() })
  }
}
