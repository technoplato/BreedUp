import React from 'react'
import { TextInput, KeyboardAvoidingView, View, Keyboard } from 'react-native'
import firebase from 'react-native-firebase'
import { Button } from 'react-native-elements'

import CommentList from '../../Components/CommentList'
import styles from './FeedScreenStyles'

/**
 * TODO
 *
 * Implement feedback on CommentList / CommentsScreen
 * Only trigger child_added once per new comment (using limitToLast(1))
 */
export default class CommentsScreen extends React.Component {
  constructor(props) {
    super(props)

    const { currentUser } = firebase.auth()
    this.currentUser = currentUser
    const postKey = this.props.navigation.getParam('key', 'NO-ID')
    const rootRef = firebase.database().ref()
    this.commentsRef = rootRef.child(`posts/${postKey}/comments`)

    this.state = { postKey: postKey, comment: '' }
  }

  addComment = () => {
    this.setState(
      {
        comment: ''
      },
      () => {
        console.log(this.state.comment)
      }
    )

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
    if (text !== '\n') console.log(text)
  }

  onKeyPress = ({ nativeEvent: { key: keyValue } }) => {
    if (keyValue === 'Enter') {
      this.setState({ comment: '' }, () => {
        console.log(this.state.comment)
      })
    }
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <CommentList postKey={this.state.postKey} />
        <TextInput
          multiline
          returnKeyType="send"
          onKeyPress={this.onKeyPress}
          blurOnSubmit={false}
          style={{ width: '100%', height: 40, padding: 24 }}
          value={this.state.comment.toString()}
          onChangeText={comment => this.onChangeText(comment)}
          onSubmitEditing={() => this.addComment()}
          placeholder="Enter comment here"
        />
        <Button height={42} title="Add Comment" onPress={this.addComment} />
      </KeyboardAvoidingView>
    )
  }
}
