import React from 'react'
import {
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Keyboard,
  KeyboardAvoidingView,
  View,
  Alert,
  Image
} from 'react-native'

import styles from './ViewDogStyles'
import { updateDog } from '../Interactors/Dog'

import CameraModal from '../../lib/InstagramCameraModal'

import { Button } from 'react-native-elements'

export default class DogDetailsScreen extends React.Component {
  constructor(props) {
    super(props)

    const { dog, currentUser = false } = this.props.navigation.state.params

    this.state = {
      oldDog: dog,
      name: dog.name,
      breed: dog.breed,
      imageUri: dog.imageUri,
      loading: false,
      photoEditModalVisible: false,
      currentUser: currentUser
    }

    this.showPhotoModal = this.showPhotoModal.bind(this)
    this.onNewDogImageUri = this.onNewDogImageUri.bind(this)
  }

  onPressUpdateDetails = () => {
    Keyboard.dismiss()

    const { oldDog, name, breed, imageUri } = this.state

    if (name === '') {
      Alert.alert('Please enter a name for your dog')
      this.setState({ loading: false })
    } else if (breed === '') {
      Alert.alert('Please enter a breed for your dog')
      this.setState({ loading: false })
    } else {
      // Show loading
      this.setState({ loading: true })

      const newDog = {
        ...oldDog,
        name,
        lowercaseName: name.toLocaleLowerCase(),
        breed,
        imageUri
      }

      // Let addDog interactor do its thing and then go back
      updateDog(oldDog, newDog).then(() => this.props.navigation.goBack())
    }
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={64}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {this.photoEditModal()}

            <TouchableHighlight
              onPress={() => {
                this.state.currentUser && this.showPhotoModal(true)
              }}
            >
              <Image
                source={{ uri: this.state.imageUri }}
                style={{ height: 144, width: 144, alignSelf: 'center' }}
              />
            </TouchableHighlight>
            {this.renderName()}
            {this.renderBreed()}
            {this.renderButton()}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )
  }

  renderName() {
    if (this.state.currentUser) {
      return (
        <TextInput
          style={styles.input}
          placeholder="Enter dog's name"
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
        />
      )
    } else {
      return <Text style={styles.input}>{this.state.name}</Text>
    }
  }

  renderBreed() {
    if (this.state.currentUser) {
      return (
        <TextInput
          style={styles.input}
          placeholder="Enter dog's breed"
          value={this.state.breed}
          onChangeText={breed => this.setState({ breed })}
        />
      )
    } else {
      return <Text style={styles.input}>{this.state.breed}</Text>
    }
  }

  renderButton() {
    if (this.state.currentUser) {
      return (
        <Button
          style={styles.button}
          loading={this.state.loading}
          disabled={this.state.loading}
          height={42}
          title="Update Dog's Details"
          onPress={this.onPressUpdateDetails}
        />
      )
    } else {
      return null
    }
  }

  photoEditModal() {
    return (
      <CameraModal
        onPictureApproved={this.onNewDogImageUri}
        isModalVisible={this.state.photoEditModalVisible}
        cancel={() => this.showPhotoModal(false)}
      />
    )
  }

  showPhotoModal(doShow) {
    this.setState({
      photoEditModalVisible: doShow
    })
  }

  onNewDogImageUri(newImageUri) {
    this.setState({ imageUri: newImageUri })
  }
}
