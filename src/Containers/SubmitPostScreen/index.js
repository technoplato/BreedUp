import React from 'react'
import {
  View,
  Text,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native'

import { Button } from 'react-native-elements'

import { createPost, submitPost } from '../../Interactors/Posts'
import DogList from '../../Components/DogList'
import { currentUser } from '../../Utils/FirebaseUtils'

import _ from 'lodash'

export default class SubmitPostScreen extends React.Component {
  state = { postText: '', saving: false, pendingDogs: [] }

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
              width: '100%',
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
          {this.pendingDogs()}
          {this.dogListToAdd()}
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
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
        </View>
      </TouchableWithoutFeedback>
    )
  }

  pendingDogs = () => {
    const { pendingDogs } = this.state
    const text = this.getPendingDogsText(pendingDogs)
    return <Text style={{ padding: 12 }}>{text}</Text>
  }

  getPendingDogsText = pendingDogs => {
    switch (pendingDogs.length) {
      case 0:
        return `Click on a dog to tag them in this post.\n\nClick a dog on the list to remove it from this post.`
      case 1:
        return `Dogs in this post: ${
          pendingDogs[0].name
        }\n\nClick a dog on the list to remove it from this post.`
      default:
        let postText = `Dogs in this post:\n${pendingDogs
          .map(dog => dog.name)
          .join('\n')}\n\nClick a dog on the list to remove it from this post.`
        return postText
    }
  }

  /**
   * Shows full list of
   */
  dogListToAdd() {
    const uid = currentUser().uid
    return (
      <View style={styles.dogListContainer}>
        <DogList
          canAddDog={false}
          onDogPress={this.onDogPress}
          navigation={this.props.navigation}
          userId={uid}
          currentUser={true}
        />
      </View>
    )
  }

  onDogPress = dog => {
    const pendingDogs = this.state.pendingDogs || []
    const index = _.findIndex(pendingDogs, { key: dog.key })
    if (index !== -1) {
      // Remove dog from pending dogs
      pendingDogs.splice(index, 1)
    } else {
      pendingDogs.push(dog)
    }
    this.setState({
      pendingDogs: pendingDogs
    })
  }

  async uploadPost() {
    this.setState({ saving: true })

    const post = await createPost(
      this.props.uri,
      this.state.postText,
      this.state.pendingDogs
    )

    const submittedPost = await submitPost(post)

    this.setState({ saving: false })
    this.props.finish()
  }

  onSubmitEditing() {
    Keyboard.dismiss
    this.uploadPost()
  }
}

const styles = StyleSheet.create({
  dogListContainer: {
    height: 90,
    width: '100%'
  }
})
