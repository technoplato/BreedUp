import React from "react"
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ActivityIndicator
} from "react-native"
import { Button } from "react-native-elements"
import firebase from "react-native-firebase"
import Modal from "react-native-modal"

import RoundImage from "../Components/RoundImageView"
import { Colors } from "../Themes"
import PostList from "../Components/PostList"
import DogList from "../Components/DogList"

import CameraModal from "../../lib/InstagramCameraModal"

import { followUser, unfollowUser, isFollowing } from "../Interactors/Users"

export default class Profile extends React.Component {
  state = {
    avatarURL: "",
    username: "",
    description: "",
    uid: "",
    currentUserProfile: false,
    modalVisible: false,
    modalSaving: false,
    modifiedUsername: "",
    modifiedDescription: "",
    modifiedAvatarURL: "",
    hasProfileChanged: false,
    loading: true,
    photoEditModalVisible: false,
    saveComplete: false,
    isFollowed: false
  }

  constructor(props) {
    super(props)

    this.showPhotoModal = this.showPhotoModal.bind(this)
    this.onNewProfileImageChosen = this.onNewProfileImageChosen.bind(this)
  }

  async componentWillMount() {
    const privateProfile =
      this.props.navigation.state.routeName === "PrivateProfile"

    const currentUid = firebase.auth().currentUser.uid
    const profileId = this.props.navigation.getParam(
      "userId",
      privateProfile ? currentUid : ""
    )

    const currentUserProfile = currentUid === profileId

    this.setState({
      uid: profileId,
      currentUserProfile: currentUserProfile
    })

    this.loadUserProfile(profileId)
  }

  loadUserProfile(profileId) {
    firebase
      .database()
      .ref()
      .child(`users/${profileId}`)
      .once("value", snap => {
        const { username, description, profileURL } = snap.val()

        this.setState({
          avatarURL: profileURL,
          username: username,
          description: description,

          modifiedAvatarURL: profileURL,
          modifiedUsername: username,
          modifiedDescription: description,

          loading: false
        })
      })

    this.loadFollowing()
  }

  loadFollowing() {
    isFollowing(this.state.uid).then(follows => {
      this.setState({ isFollowed: follows })
    })
  }

  setTextEditingModalVisible(visible) {
    this.setState({
      modalVisible: visible,
      saveComplete: !visible
    })
  }

  setSaving(saving) {
    this.setState({ modalSaving: saving })
  }

  onUsernameChange = newUsername => {
    const usernameChange = this.state.username !== newUsername
    this.setState({
      usernameChange: usernameChange,
      modifiedUsername: newUsername,
      hasProfileChanged: this.state.hasProfileChanged || usernameChange
    })
  }

  onDescriptionChange = newDescription => {
    const descriptionChange = this.state.description !== newDescription
    this.setState({
      descriptionChange: descriptionChange,
      modifiedDescription: newDescription,
      hasProfileChanged: this.state.hasProfileChanged || descriptionChange
    })
  }

  modal() {
    return (
      <Modal
        isVisible={this.state.modalVisible && !this.state.saveComplete}
        onBackdropPress={() => this.setTextEditingModalVisible(false)}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <View style={{ width: "100%", height: "70%" }}>
          <View style={{ padding: 12, backgroundColor: "white" }}>
            <Text>Username</Text>
            <TextInput
              maxLength={20}
              style={{ marginBottom: 24 }}
              onChangeText={this.onUsernameChange}
              value={this.state.username}
            />

            <Text>Description</Text>
            <TextInput
              maxLength={120}
              multiline
              onChangeText={this.onDescriptionChange}
              value={this.state.description}
            />
          </View>
          <View
            style={{
              flex: 1,
              paddingBottom: 12,
              minHeight: 42,
              backgroundColor: "grey",
              justifyContent: "flex-end"
            }}
          >
            <Button
              title={this.state.modalSaving ? "Saving..." : "Save Info"}
              loading={this.state.modalSaving}
              disabled={this.state.modalSaving}
              onPress={async () => {
                if (this.state.hasProfileChanged) {
                  await this.saveProfileData()
                } else {
                  this.setTextEditingModalVisible(false)
                }
              }}
            />
          </View>
        </View>
      </Modal>
    )
  }

  async saveProfileData() {
    this.setTextEditingModalVisible(false)
    this.setSaving(false)

    const { modifiedDescription, modifiedUsername } = this.state

    const petImageArray = await firebase
      .database()
      .ref()
      .child("dogs")
      .child(this.state.uid)
      .once("value")
      .then(snap => {
        const keysArray = Object.keys(snap.val() || [])
        const results = keysArray
          .map(key => snap.val()[key])
          .map(dog => dog.imageUri)
        return results
      })

    firebase
      .database()
      .ref()
      .child(`users/${this.state.uid}`)
      .update({
        description: modifiedDescription,
        username: modifiedUsername.toLowerCase()
      })
      .then(() => {
        this.setState({
          username: modifiedUsername,
          description: modifiedDescription,

          hasProfileChanged: false,
          usernameChange: false,
          descriptionChange: false
        })
      })

    firebase
      .firestore()
      .collection("users")
      .doc(this.state.uid)
      .update({
        username: modifiedUsername.toLowerCase(),
        uid: this.state.uid
      })

    firebase
      .database()
      .ref()
      .child("names")
      .child("users")
      .child(this.state.uid)
      .set({
        username: modifiedUsername.toLowerCase(),
        uid: this.state.uid,
        dogs: petImageArray,
        description: modifiedDescription
      })
  }

  render() {
    return (
      <View style={styles.screen.container}>
        {this.photoEditModal()}
        {this.modal()}
        {this.header()}
        {this.dogList()}
        {this.postsList()}
        {this.state.loading && this.renderLoading()}
      </View>
    )
  }

  photoEditModal() {
    return (
      <CameraModal
        onPictureApproved={this.onNewProfileImageChosen}
        isModalVisible={this.state.photoEditModalVisible}
        cancel={() => this.showPhotoModal(false)}
      />
    )
  }

  onNewProfileImageChosen(newProfileImageUri) {
    // Optimistically update image URI
    this.setState({
      avatarURL: newProfileImageUri
    })

    // Store photo in storage
    const storageRef = firebase.storage().ref()

    const id = firebase.auth().currentUser.uid

    const currentUserProfileRef = firebase
      .database()
      .ref()
      .child(`users/${id}`)

    const userProfileImageStorageRef = storageRef.child(id).child("profile_img")

    let updatedUrl

    // Save photo URL to Firebase database
    return userProfileImageStorageRef
      .put(newProfileImageUri)
      .then(snapshot => snapshot.downloadURL)
      .then(url => {
        updatedUrl = url
        firebase
          .database()
          .ref()
          .child("names")
          .child("users")
          .child(id)
          .set({
            photoURL: updatedUrl
          })
        firebase
          .firestore()
          .collection("users")
          .doc(id)
          .update({
            profileURL: updatedUrl,
            photoURL: updatedUrl
          })
        return currentUserProfileRef.update({
          profileURL: updatedUrl,
          photoURL: updatedUrl
        })
      })
      .then(() => {
        firebase.auth().currentUser.updateProfile({
          photoURL: updatedUrl
        })
      })
      .then(() => {
        const { avatarURL } = this.state
        if (avatarURL !== updatedUrl) {
          this.setState({ avatarURL: updatedUrl })
        }
      })
  }

  showPhotoModal(doShow) {
    this.setState({
      photoEditModalVisible: doShow
    })
  }

  renderLoading() {
    return (
      <View
        style={{
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          width: "100%",
          height: "100%"
        }}
      >
        <ActivityIndicator size="large" color={Colors.crimson} />
      </View>
    )
  }

  header() {
    return (
      <View style={styles.header.container}>
        <View style={styles.header.avatarContainer}>
          <RoundImage
            onPress={() => {
              this.state.currentUserProfile && this.showPhotoModal(true)
            }}
            size={120}
            source={{
              uri:
                this.state.avatarURL ||
                "https://user-images.githubusercontent.com/6922904/43790322-455b8dda-9a40-11e8-800e-09b299ace3b3.png"
            }}
          />
        </View>
        <View style={styles.header.textAndButtonContainer}>
          <View style={styles.header.topRow}>
            <View style={styles.header.usernameContainer}>
              <Text style={styles.header.username}>{this.state.username}</Text>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text>{this.state.description}</Text>
          </View>

          <View style={styles.header.buttonContainer}>
            {this.state.currentUserProfile
              ? this.renderEditProfileButton()
              : this.renderFollowButton()}
          </View>
        </View>
      </View>
    )
  }

  renderEditProfileButton() {
    return (
      <Button
        type="outline"
        titleStyle={{ color: "black" }}
        buttonStyle={{
          backgroundColor: "white",
          borderWidth: 2,
          borderColor: Colors.dogBoneBlue
        }}
        title={"Edit Profile"}
        onPress={() => {
          this.setTextEditingModalVisible(true)
        }}
      />
    )
  }

  renderFollowButton() {
    return (
      <Button
        type="outline"
        titleStyle={{ color: "black" }}
        buttonStyle={{
          backgroundColor: "white",
          borderWidth: 2,
          borderColor: Colors.dogBoneBlue
        }}
        title={!this.state.isFollowed ? "Add to Pack" : "Unfollow"}
        onPress={() => {
          if (!this.state.isFollowed) {
            followUser(this.state.uid).then(followed => {
              this.setState({ isFollowed: true })
            })
          } else {
            unfollowUser(this.state.uid).then(followed => {
              this.setState({ isFollowed: false })
            })
          }
        }}
      />
    )
  }

  dogList() {
    return (
      <View style={styles.dogList.container}>
        <DogList
          navigation={this.props.navigation}
          userId={this.state.uid}
          currentUser={this.state.currentUserProfile}
          canAddDog={this.state.currentUserProfile}
          onDogPress={this.onDogPress}
        />
      </View>
    )
  }

  onDogPress = dog => {
    this.props.navigation.navigate("ViewDog", {
      dog: dog,
      currentUser: this.state.currentUserProfile || false,
      onDogUpdated: this.onDogUpdated
    })
  }

  onDogUpdated = (oldDog, updatedDog) => {
    const dogs = this.state.dogs
    const index = dogs.indexOf(oldDog)
    dogs.splice(index, 1, updatedDog)
    this.setState({ dogs: dogs })
  }

  postsList() {
    return (
      <View style={styles.postList.container}>
        <PostList
          style={styles.postList.list}
          navigation={this.props.navigation}
          userId={this.state.uid}
          onAvatarPressed={this.onAvatarPressed}
        />
      </View>
    )
  }

  onAvatarPressed = () => {
    // ignored in profile view
  }
}

const styles = {
  screen: StyleSheet.create({
    container: {
      flex: 1
    }
  }),

  header: StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: "white",
      width: "100%"
    },
    textAndButtonContainer: {
      flex: 1,
      paddingRight: 12
    },
    topRow: {
      marginTop: 12,
      justifyContent: "space-between",
      flexDirection: "row"
    },
    avatarContainer: {
      margin: 12,
      height: 120,
      width: 120
    },
    usernameContainer: {
      alignItems: "center",
      justifyContent: "center"
    },
    buttonContainer: { padding: 8 },
    avatar: {
      height: 92,
      borderRadius: 46,
      width: 92
    },
    descriptionContainer: {},
    username: { fontSize: 22 }
  }),

  dogList: StyleSheet.create({
    container: {
      height: 96,
      width: "100%",
      borderTopWidth: 1,
      borderColor: "grey"
    },
    list: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    }
  }),

  postList: StyleSheet.create({
    container: {},
    list: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    }
  }),

  modal: StyleSheet.create({
    bottomButtonContainer: {
      position: "absolute",
      right: 0,
      flex: 1,
      minHeight: 42,
      backgroundColor: "grey"
    }
  })
}
