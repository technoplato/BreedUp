import React from 'react'
import {
  View,
  Text,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'
import { Button } from 'react-native-elements'
import firebase from 'react-native-firebase'

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

  // Refactor this to use new interactors
  uploadPost() {
    this.setState({ saving: true })
    // const storageRef = firebase.storage().ref()
    // const rootRef = firebase.database().ref()

    const id = firebase.auth().currentUser.uid

    const userPostsRef = rootRef.child('posts/' + id).push()
    const ref = rootRef.child('posts').push()

    let photoUrl

    const userPostImagesStorageRef = storageRef
      .child(id)
      .child('posts/images')
      .child(ref.key)

    return userPostImagesStorageRef
      .put(this.props.uri)
      .then(snapshot => snapshot.downloadURL)
      .then(url => {
        photoUrl = url
        return ref.set({
          author: firebase.auth().currentUser.displayName,
          author_img: firebase.auth().currentUser.photoURL,
          author_id: firebase.auth().currentUser.uid,
          post_img: url,
          time_posted: new Date().getTime(),
          reverse_timestamp: -1 * new Date().getTime(),
          text: this.state.postText,
          key: ref.key
        })
      })
      .then(() => {
        return userPostsRef.set({
          author: firebase.auth().currentUser.displayName,
          author_img: firebase.auth().currentUser.photoURL,
          author_id: firebase.auth().currentUser.uid,
          post_img: photoUrl,
          time_posted: new Date().getTime(),
          reverse_timestamp: -1 * new Date().getTime(),
          text: this.state.postText,
          key: ref.key
        })
      })
      .then(() => {
        this.setState({ saving: false })
        this.props.finish()
      })
  }

  onSubmitEditing() {
    Keyboard.dismiss
    this.uploadPost()
  }
}
