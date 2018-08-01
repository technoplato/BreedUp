import React from 'react'
import { View, Text, Button } from 'react-native'
import firebase from 'react-native-firebase'
import ImagePicker from 'react-native-image-picker'
import Modal from 'react-native-modal'

import styles from './AddPostScreenStyles'

export default class AddPostScreen extends React.Component {
  state = { modalVisible: true }
  constructor(props) {
    super(props)

    this.cancelPhoto = this.cancelPhoto.bind(this)
    this.revealPhotoModal = this.revealPhotoModal.bind(this)
  }

  revealPhotoModal() {
    this.setState({ modalVisible: true })
  }

  componentDidMount() {
    console.log('alksdfj')

    this.props.navigation.addListener('didFocus', this.revealPhotoModal)

    this.state = { modalVisible: true }
  }

  cancelPhoto() {
    this.setState({ modalVisible: false })
    this.props.navigation.goBack()
  }

  render() {
    return (
      <Test1
        navigation={this.props.navigation}
        isVisible={this.state.modalVisible}
        cancel={this.cancelPhoto}
      />
    )
  }

  addPost = () => {
    const ref = firebase
      .database()
      .ref()
      .child('posts')
      .push()

    ref.set({
      author: firebase.auth().currentUser.displayName,
      author_img: firebase.auth().currentUser.profileURL,
      time_posted: new Date().getTime(),
      reverse_timestamp: -1 * new Date().getTime(),
      text:
        'My dog is the best dog in the entire world and I want this post to be long enough to be a few lines',
      key: ref.key
    })
  }
}

class Test1 extends React.Component {
  state = { modalVisible: true, userIsApproving: false }

  constructor(props) {
    super(props)

    this.showCamera = this.showCamera.bind(this)
    this.pickImageFromLibrary = this.pickImageFromLibrary.bind(this)
  }

  render() {
    return (
      <Modal style={{ margin: 0 }} isVisible={this.props.isVisible}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 0.55,
              backgroundColor: 'grey',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text>{this.state.userIsApproving ? 'Still Image' : 'Camera'}</Text>
          </View>
          <View
            style={{
              flex: 0.45,
              backgroundColor: 'pink',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text>
              {this.state.userIsApproving ? 'Approve Picture' : 'Take Picture'}
            </Text>
            <View
              style={{
                padding: 16,
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'absolute',
                bottom: 0,
                width: '100%'
              }}
            >
              <Text
                onPress={() => {
                  if (this.state.userIsApproving) {
                    this.showCamera()
                  } else {
                    this.pickImageFromLibrary()
                  }
                }}
              >
                {this.state.userIsApproving ? 'Retake' : 'Library'}
              </Text>
              <Text onPress={() => this.props.cancel()}>Cancel</Text>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  showCamera() {
    this.setState({
      userIsApproving: false
    })
  }

  pickImageFromLibrary() {
    ImagePicker.launchImageLibrary(null, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton)
      } else {
        this.setState({
          uri: response.uri,
          userIsApproving: true
        })
      }
    })
  }
}

class Test2 extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Test2</Text>
      </View>
    )
  }
}

export { Test1, Test2 }
