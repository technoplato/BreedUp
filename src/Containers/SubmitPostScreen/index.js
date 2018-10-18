import React from 'react'
import {
  View,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'
import { Button } from 'react-native-elements'

import { createPost, submitPost } from '../../Interactors/Posts'

export default class SubmitPostScreen extends React.Component {
  state = { postText: '', saving: false }

  constructor(props) {
    super(props)

    this.onSubmitEditing = this.onSubmitEditing.bind(this)
    this.uploadPost = this.uploadPost.bind(this)
  }

  render() {
    const { uri } = this.props
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              padding: 16,
              marginTop: 24
            }}
          >
            <Image style={{ height: 100, width: 100 }} source={{ uri: uri }} />
            <TextInput
              style={{ marginLeft: 12, flex: 1, height: 100 }}
              placeholder="Write a caption..."
              multiline
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              onChangeText={text => this.setState({ postText: text })}
            />
          </View>
          <Button
            style={{ marginBottom: 24 }}
            title="Submit"
            loading={this.state.saving}
            disabled={this.state.saving}
            onPress={() => {
              this.uploadPost().then(() => this.props.finish())
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }

  async uploadPost() {
    this.setState({ saving: true })

    const post = await createPost(this.props.uri, this.state.postText)

    const post = await submitPost(post)

    this.setState({ saving: false })
    this.props.finish()
  }

  onSubmitEditing() {
    Keyboard.dismiss
    this.uploadPost()
  }
}
