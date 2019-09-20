import React from 'react'
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TextInput,
  ActivityIndicator
} from 'react-native'
import { Button } from 'react-native-elements'
import Modal from 'react-native-modal'

import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

import uploadImage from 'utilities/upload-image'

import RoundImage from '../Components/RoundImageView'
import { Colors } from '../Themes'
import DogList from '../Components/DogList'

import CameraModal from '../../lib/InstagramCameraModal'

import { followUser, unfollowUser, isFollowing } from '../Interactors/Users'
import PostsList from '../Components/PostsList'

export default class Profile extends React.Component {
  constructor(props) {
    super(props)

    this.showPhotoModal = this.showPhotoModal.bind(this)
    this.onNewProfileImageChosen = this.onNewProfileImageChosen.bind(this)

    const privateProfile =
      this.props.navigation.state.routeName === 'PrivateProfile'

    const currentUid = auth().currentUser.uid
    const profileId = this.props.navigation.getParam(
      'userId',
      privateProfile ? currentUid : ''
    )

    const myProfile = currentUid === profileId

    this.state = {
      uid: profileId,
      myProfile: myProfile,
      profileURL: '',
      username: '',
      description: '',
      modalVisible: false,
      modalSaving: false,
      modifiedUsername: '',
      modifiedDescription: '',
      modifiedPhotoURL: '',
      hasProfileChanged: false,
      loading: true,
      photoEditModalVisible: false,
      saveComplete: false,
      isFollowed: false
    }

    this.userRef = firestore()
      .collection('users')
      .doc(profileId)
  }

  async componentDidMount() {
    const [user, iFollow] = await Promise.all([
      this.loadUserProfile(),
      this.amIFollowing()
    ])

    const { username, description, photoURL } = user

    this.props.navigation.setParams({ username })

    this.setState({
      photoURL,
      username,
      description,

      modifiedPhotoURL: photoURL,
      modifiedUsername: username,
      modifiedDescription: description,

      isFollowed: iFollow,
      loading: false
    })
  }

  async loadUserProfile() {
    return await this.userRef.get().then(doc => doc.data())
  }

  async amIFollowing() {
    return await isFollowing(this.state.uid)
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

  async saveProfileData() {
    this.setTextEditingModalVisible(false)
    this.setSaving(false)

    const { modifiedDescription, modifiedUsername } = this.state

    await this.userRef.update({
      description: modifiedDescription,
      username: modifiedUsername.toLowerCase()
    })

    this.setState({
      username: modifiedUsername,
      description: modifiedDescription,

      hasProfileChanged: false,
      usernameChange: false,
      descriptionChange: false
    })
  }

  async onNewProfileImageChosen(newProfileImageUri) {
    this.setState({
      profileURL: newProfileImageUri
    })

    const updatedUrl = await uploadImage(
      newProfileImageUri,
      `${this.state.uid}/profile_img`
    )

    this.userRef.update({
      photoURL: updatedUrl
    })

    this.setState({ profileURL: updatedUrl })
  }

  showPhotoModal(doShow) {
    this.setState({
      photoEditModalVisible: doShow
    })
  }

  renderEditProfileButton() {
    return (
      <Button
        type="outline"
        titleStyle={{ color: 'black' }}
        buttonStyle={{
          backgroundColor: 'white',
          borderWidth: 2,
          borderColor: Colors.dogBoneBlue
        }}
        title={'Edit Profile'}
        onPress={() => {
          this.setTextEditingModalVisible(true)
        }}
      />
    )
  }

  onDogPress = dog => {
    this.props.navigation.navigate('ViewDog', {
      dog: dog,
      currentUser: this.state.myProfile
    })
  }

  postsList() {
    return (
      <View style={styles.postList.list}>
        <PostsList
          navigation={this.props.navigation}
          userId={this.state.uid}
          onAvatarPressed={this.onAvatarPressed}
        />
      </View>
    )
  }

  onAvatarPressed = author => {
    // ignored in profile view
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

  modal() {
    return (
      <Modal
        isVisible={this.state.modalVisible && !this.state.saveComplete}
        onBackdropPress={() => this.setTextEditingModalVisible(false)}
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ width: '100%', height: '70%' }}>
            <View style={{ padding: 12, backgroundColor: 'white' }}>
              <Text>Username</Text>
              <TextInput
                maxLength={20}
                style={{ marginBottom: 24 }}
                onChangeText={this.onUsernameChange}
                value={this.state.modifiedUsername}
              />

              <Text>Description</Text>
              <TextInput
                maxLength={120}
                multiline
                onChangeText={this.onDescriptionChange}
                value={this.state.modifiedDescription}
              />
            </View>
            <View
              style={{
                flex: 1,
                paddingBottom: 12,
                minHeight: 42,
                backgroundColor: 'grey',
                justifyContent: 'flex-end'
              }}
            >
              <Button
                title={this.state.modalSaving ? 'Saving...' : 'Save Info'}
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
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  header() {
    return (
      <View style={styles.header.container}>
        <View style={styles.header.avatarContainer}>
          <RoundImage
            onPress={() => {
              this.state.myProfile && this.showPhotoModal(true)
            }}
            size={120}
            source={{
              uri:
                this.state.profileURL ||
                'https://user-images.githubusercontent.com/6922904/43790322-455b8dda-9a40-11e8-800e-09b299ace3b3.png'
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
            {this.state.myProfile
              ? this.renderEditProfileButton()
              : this.renderFollowButton()}
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
          currentUser={this.state.myProfile}
          canAddDog={this.state.myProfile}
          onDogPress={this.onDogPress}
        />
      </View>
    )
  }

  renderLoading() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          width: '100%',
          height: '100%'
        }}
      >
        <ActivityIndicator size="large" color={Colors.crimson} />
      </View>
    )
  }

  renderFollowButton() {
    return (
      <Button
        type="outline"
        titleStyle={{ color: 'black' }}
        buttonStyle={{
          backgroundColor: 'white',
          borderWidth: 2,
          borderColor: Colors.dogBoneBlue
        }}
        title={!this.state.isFollowed ? 'Add to Pack' : 'Unfollow'}
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
}

const styles = {
  screen: StyleSheet.create({
    container: {
      flex: 1
    }
  }),

  header: StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: 'white',
      width: '100%'
    },
    textAndButtonContainer: {
      flex: 1,
      paddingRight: 12
    },
    topRow: {
      marginTop: 12,
      justifyContent: 'space-between',
      flexDirection: 'row'
    },
    avatarContainer: {
      margin: 12,
      height: 120,
      width: 120
    },
    usernameContainer: {
      alignItems: 'center',
      justifyContent: 'center'
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
      width: '100%',
      borderTopWidth: 1,
      borderColor: 'grey'
    },
    list: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
  }),

  postList: StyleSheet.create({
    container: {},
    list: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }
  }),

  modal: StyleSheet.create({
    bottomButtonContainer: {
      position: 'absolute',
      right: 0,
      flex: 1,
      minHeight: 42,
      backgroundColor: 'grey'
    }
  })
}
