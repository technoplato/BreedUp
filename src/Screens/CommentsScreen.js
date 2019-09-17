import React from 'react'
import { TextInput, Keyboard } from 'react-native'
import { Button } from 'react-native-elements'
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
import { SafeAreaView } from 'react-navigation'

import CommentList from '../Components/CommentList'
import styles from '../Styles/CommentsScreenStyles'
import { addComment } from '../Interactors/Comments'

export default class CommentsScreen extends React.Component {
  constructor(props) {
    super(props)

    const post = this.props.navigation.getParam('post', 'NO-ID')

    this.state = { post, comment: '' }

    this.onSubmitEditing = this.onSubmitEditing.bind(this)
  }

  onPressAddComment = () => {
    Keyboard.dismiss()

    this.setState({ comment: '' })

    addComment(this.state.post, this.state.comment)
  }

  onChangeText = text => {
    this.setState({ comment: text })
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareView
          style={{
            flex: 1
          }}
        >
          <CommentList post={this.state.post} />
          <TextInput
            style={styles.input}
            value={this.state.comment.toString()}
            onChangeText={comment => this.onChangeText(comment)}
            onSubmitEditing={this.onSubmitEditing}
            placeholder="Enter comment"
          />
          <Button
            style={{ alignSelf: 'center' }}
            title="Add Comment"
            onPress={this.onPressAddComment}
          />
        </KeyboardAwareView>
      </SafeAreaView>
    )
  }

  onSubmitEditing() {
    Keyboard.dismiss
    const { comment } = this.state
    this.setState({ comment: comment.trim() })
  }
}
