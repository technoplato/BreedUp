import React from 'react'
import { TextInput, KeyboardAvoidingView, Keyboard } from 'react-native'
import firebase from 'react-native-firebase'
import { Button } from 'react-native-elements'

import CommentList from '../../Components/CommentList'
import styles from './CommentsScreenStyles'

export default class CommentsScreen extends React.Component {
  constructor(props) {
    super(props)

    const { currentUser } = firebase.auth()
    this.currentUser = currentUser
    const postKey = this.props.navigation.getParam('key', 'NO-ID')
    const rootRef = firebase.database().ref()
    this.commentsRef = rootRef.child(`posts/${postKey}/comments`)

    this.state = { postKey: postKey, comment: '' }

    this.onSubmitEditing = this.onSubmitEditing.bind(this)
  }

  addComment = () => {
    this.setState({
      comment: ''
    })

    Keyboard.dismiss()

    const ref = this.commentsRef.push()

    ref.set({
      author: this.currentUser.displayName,
      time_posted: new Date().getTime(),
      reverse_timestamp: -1 * new Date().getTime(),
      text: this.state.comment,
      key: ref.key
    })
  }

  onChangeText = text => {
    this.setState({ comment: text })
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <CommentList postKey={this.state.postKey} />
        <TextInput
          style={styles.input}
          value={this.state.comment.toString()}
          onChangeText={comment => this.onChangeText(comment)}
          onSubmitEditing={this.onSubmitEditing}
          placeholder="Enter comment"
        />
        <Button height={42} title="Add Comment" onPress={this.addComment} />
      </KeyboardAvoidingView>
    )
  }

  onSubmitEditing() {
    Keyboard.dismiss
    const { comment } = this.state
    this.setState({
      comment: comment.trim()
    })
  }
}
