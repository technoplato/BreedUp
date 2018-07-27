import React, { Component } from 'react'
import { Button, Text, View, Image } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import firebase from 'react-native-firebase'

import Camera from '../../Components/Camera'
import styles from './ChooseImageStyles'

/*
 * TODO - I'm going to hard code this screen as the onboarding choose image screen.
 * 
 * However, it should be modularized and used in multiple different locations, namely the Profile AND here.
 */
export default class ChooseImage extends Component {
  static navigationOptions = {
    title: 'Upload Profile Image'
  }

  constructor(props) {
    super(props)

    this.state = {
      camera: false,
      photoUri: '',
      errorMsg: ''
    }

    this.uploadImage = this.uploadImage.bind(this)
    this.onNewPhotoUri = this.onNewPhotoUri.bind(this)
    this.pickImage = this.pickImage.bind(this)
  }

  enableCamera = (args, vargs) => {
    this.setState({
      camera: true
    })
  }

  disableCamera = (args, vargs) => {
    this.setState({
      camera: false
    })
  }

  renderHome() {
    return (
      <View style={styles.container}>
        <Button
          title="Use Camera"
          onPress={() => this.enableCamera('args', 'vargs')}
        />

        <Button title="Pick Image" onPress={() => this.pickImage()} />

        <Text>{this.state.photoUri || 'Take a picture to display URI'}</Text>

        <Image
          style={styles.thumb}
          source={{ isStatic: true, uri: this.state.photoUri }}
        />

        <Button
          onPress={() => {
            this.uploadImage(this.state.photoUri)
          }}
          title="Upload Image!"
        />
      </View>
    )
  }

  render() {
    const { camera } = this.state

    return (
      <View style={styles.container}>
        {camera ? (
          <Camera onNewPhotoUri={this.onNewPhotoUri} />
        ) : (
          this.renderHome()
        )}
      </View>
    )
  }

  pickImage = () => {
    ImagePicker.launchImageLibrary(null, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton)
      } else {
        this.onNewPhotoUri(response.uri)
      }
    })
  }

  onNewPhotoUri = newUri => {
    console.log(newUri)
    if (newUri) {
      this.setState({ photoUri: newUri })
      this.disableCamera()
    }
  }

  uploadImage = imageUri => {
    if (!imageUri) {
      this.setState({
        errorMsg: 'Please snap a photo before attempting to upload.'
      })
    } else {
      const storageRef = firebase.storage().ref()

      const id = firebase.auth().currentUser.uid

      const testRef = storageRef.child(id).child('profile-img')

      let storageURL

      testRef
        .put(imageUri)
        .then(snapshot => {
          return snapshot.downloadURL
        })
        .then(url => {
          storageURL = url
          return firebase
            .database()
            .ref()
            .child('users')
            .child(id)
            .child('profileURL')
            .set(url)
        })
        .then(() => {
          return firebase.auth().currentUser.updateProfile({
            photoURL: storageURL
          })
        })
        .then(profileImgSet => this.props.navigation.navigate('Profile'))
    }
  }
}
