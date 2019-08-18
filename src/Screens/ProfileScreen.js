import React from "react"
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ActivityIndicator
} from "react-native"
import { Button } from "react-native-elements"
import firebase, { Notification, NotificationOpen } from "react-native-firebase"
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

    await this.setupNotificationPermissions()
    self.removeNotificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed(notification => {
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        const { title, body } = notification
        self.showAlert(title, body)
      })
    self.removeNotificationListener = firebase
      .notifications()
      .onNotification(notification => {
        // Process your notification as required
        notification.android.setChannelId("test-channel")
        const { title, body } = notification
        this.showAlert(title, body)
      })

    self.removeNotificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        // Get the action triggered by the notification being opened
        const { action } = notificationOpen
        // Get information about the notification that was opened
        const { notification } = notificationOpen
        console.log(notification)
      })

    console.log("Finished componentWillMount")
  }

  componentWillUnmount() {
    this.removeNotificationDisplayedListener()
    this.removeNotificationListener()
    this.removeNotificationOpenedListener()
  }

  async setupNotificationPermissions() {
    const enabled = await firebase.messaging().hasPermission()
    console.log("Are permissions enabled: ", enabled)
    if (enabled) {
      firebase
        .messaging()
        .getToken()
        .then(token => {
          console.log("token====token", token)
        })
    } else {
      try {
        await firebase.messaging().requestPermission()

        firebase
          .messaging()
          .getToken()
          .then(token => {
            console.log("token====token", token)
          })
        // User has authorised
      } catch (error) {
        // User has rejected permissions
      }
    }
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
        <View style={{ width: "100%", height: "100%" }}>
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
              onPress={() => {
                if (this.state.hasProfileChanged) {
                  this.saveProfileData()
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

  saveProfileData() {
    this.setTextEditingModalVisible(false)
    this.setSaving(false)

    const {
      modifiedDescription,
      modifiedAvatarURL,
      modifiedUsername
    } = this.state

    firebase
      .database()
      .ref()
      .child(`users/${this.state.uid}`)
      .update({
        description: modifiedDescription,
        profileURL: modifiedAvatarURL,
        photoURL: modifiedAvatarURL,
        username: modifiedUsername.toLowerCase()
      })
      .then(() => {
        this.setState({
          avatarURL: modifiedAvatarURL,
          username: modifiedUsername,
          description: modifiedDescription,

          hasProfileChanged: false,
          usernameChange: false,
          descriptionChange: false
        })
      })

    firebase
      .database()
      .ref()
      .child("names")
      .child("users")
      .child(this.state.uid)
      .set({ username: modifiedUsername.toLowerCase(), uid: this.state.uid })
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
        isVisible={this.state.photoEditModalVisible}
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
            onPress={this.state.currentUserProfile && this.showPhotoModal}
            size={92}
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
              <Text
                onPress={() => {
                  {
                    if (this.state.currentUserProfile) {
                      this.setTextEditingModalVisible(true)
                    }
                  }
                }}
                style={styles.header.username}
              >
                {this.state.username}
              </Text>
            </View>
            <View style={styles.header.buttonContainer}>
              {!this.state.currentUserProfile && (
                <Button
                  buttonStyle={{ backgroundColor: Colors.dogBoneBlue }}
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
              )}
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text onPress={() => this.setTextEditingModalVisible(true)}>
              {this.state.description}
            </Text>
          </View>
        </View>
      </View>
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
        )
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
      height: 92,
      width: 92
    },
    usernameContainer: {
      alignItems: "center",
      justifyContent: "center"
    },
    buttonContainer: {
      alignItems: "center",
      justifyContent: "center"
    },
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
      height: 90,
      width: "100%"
    },
    list: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    }
  }),

  postList: StyleSheet.create({
    container: {
      flex: 1
    },
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
