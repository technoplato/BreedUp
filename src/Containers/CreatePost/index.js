import React from 'react'
import { View, Text, Image, TextInput } from 'react-native'
import { Button } from 'react-native-elements'
import firebase from 'react-native-firebase'

export default class CreatePostScreen extends React.Component {
  state = { postText: '' }
  render() {
    const { uri } = this.props
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View
          style={{ flex: 1, flexDirection: 'row', padding: 16, marginTop: 24 }}
        >
          <Image style={{ height: 100, width: 100 }} source={{ uri: uri }} />
          <TextInput
            style={{ marginLeft: 12, flex: 1, height: 100 }}
            placeholder="Write a caption..."
            multiline
            onChangeText={text => this.setState({ postText: text })}
          />
        </View>
        <Button
          title="Tester"
          // disabled={!this.props.uri && !this.state.postText}
          onPress={() => {
            this.uploadPost().then(() => this.props.finish())
          }}
        />
      </View>
    )
  }

  uploadPost() {
    const user = firebase.auth().currentUser
    const storageRef = firebase.storage().ref()

    const id = firebase.auth().currentUser.uid

    const ref = firebase
      .database()
      .ref()
      .child('posts')
      .push()

    const userPostImagesStorageRef = storageRef
      .child(id)
      .child('posts/images')
      .child(ref.key)

    return userPostImagesStorageRef
      .put(this.props.uri)
      .then(snapshot => snapshot.downloadURL)
      .then(url => {
        return ref.set({
          author: firebase.auth().currentUser.displayName,
          author_img: firebase.auth().currentUser.photoURL,
          post_img: url,
          time_posted: new Date().getTime(),
          reverse_timestamp: -1 * new Date().getTime(),
          text: this.state.postText,
          key: ref.key
        })
      })
  }
}
