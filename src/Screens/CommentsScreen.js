import React from "react"
import { TextInput, KeyboardAvoidingView, Keyboard } from "react-native"
import { Button } from "react-native-elements"

import CommentList from "../Components/CommentList"
import styles from "../Styles/CommentsScreenStyles"
import { addComment } from "../Interactors/Comments"

export default class CommentsScreen extends React.Component {
  constructor(props) {
    super(props)

    const post = this.props.navigation.getParam("post", "NO-ID")

    this.state = { post: post, comment: "" }

    this.onSubmitEditing = this.onSubmitEditing.bind(this)
  }

  onPressAddComment = () => {
    Keyboard.dismiss()

    this.setState({ comment: "" })

    addComment(this.state.post, this.state.comment)
  }

  onChangeText = text => {
    this.setState({ comment: text })
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <CommentList postId={this.state.post.key} />
        <TextInput
          style={styles.input}
          value={this.state.comment.toString()}
          onChangeText={comment => this.onChangeText(comment)}
          onSubmitEditing={this.onSubmitEditing}
          placeholder="Enter comment"
        />
        <Button
          height={42}
          title="Add Comment"
          onPress={this.onPressAddComment}
        />
      </KeyboardAvoidingView>
    )
  }

  onSubmitEditing() {
    Keyboard.dismiss
    const { comment } = this.state
    this.setState({ comment: comment.trim() })
  }
}
