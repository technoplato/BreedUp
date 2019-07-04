import React from "react"
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
} from "react-native"
import { Button } from "react-native-elements"

import styles from "./AddDogStyles"
import { addDog } from "../../Interactors/Dog"

import CameraModal from "../../../lib/InstagramCameraModal"

export default class AddDog extends React.Component {
  state = {}
  constructor(props) {
    super(props)

    const ownerId = this.props.navigation.getParam("userId", "NO-ID")

    this.state = {
      ownerId: ownerId,
      name: "",
      breed: "",
      imageUri: "",
      loading: false,
      photoEditModalVisible: false
    }

    this.showPhotoModal = this.showPhotoModal.bind(this)
    this.onNewDogImageUri = this.onNewDogImageUri.bind(this)
  }

  onPressAddDog = async () => {
    Keyboard.dismiss()

    // Show loading
    this.setState({
      loading: true
    })

    // Verify input
    const { ownerId, name, breed, imageUri } = this.state

    if (imageUri === "") {
      Alert.alert("Please provide a picture for your dog")
      this.setState({
        loading: false
      })
    } else if (name === "") {
      Alert.alert("Please enter a name for your dog")
      this.setState({
        loading: false
      })
    } else if (breed === "") {
      Alert.alert("Please enter a breed for your dog")
      this.setState({
        loading: false
      })
    } else {
      // Let addDog interactor do its thing and then go back
      const dog = await addDog(ownerId, name, breed, imageUri)
      this.props.navigation.state.params.onNewDogAdded(dog)
      this.props.navigation.goBack()
    }
  }

  render() {
    const { imageUri } = this.state
    const image = imageUri ? (
      <Image
        source={{ uri: this.state.imageUri }}
        style={{ height: 144, width: 144, alignSelf: "center" }}
      />
    ) : (
      <Text
        style={{
          backgroundColor: "grey",
          padding: 12,
          width: 220,
          alignSelf: "center",
          fontSize: 32
        }}
        onPress={() => this.showPhotoModal(true)}
      >
        Click to take a picture of your dog
      </Text>
    )

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
                this.showPhotoModal(true)
              }}
            >
              {image}
            </TouchableHighlight>

            <TextInput
              style={styles.input}
              placeholder="Enter dog's name"
              value={this.state.name}
              onChangeText={name => this.setState({ name })}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter dog's breed"
              value={this.state.breed}
              onChangeText={breed => this.setState({ breed })}
            />

            <Button
              style={styles.button}
              loading={this.state.loading}
              disabled={this.state.loading}
              height={42}
              title="Add Dog"
              onPress={this.onPressAddDog}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )
  }

  photoEditModal() {
    return (
      <CameraModal
        onPictureApproved={this.onNewDogImageUri}
        isVisible={this.state.photoEditModalVisible}
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
