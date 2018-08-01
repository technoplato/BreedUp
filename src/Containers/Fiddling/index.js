import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ActivityIndicator
} from 'react-native'
import { Button } from 'react-native-elements'
import firebase from 'react-native-firebase'
import Modal from 'react-native-modal'
import _ from 'lodash'

import RoundImage from '../../Components/RoundImageView'
import { Colors } from '../../Themes'

export default class Fiddling extends React.Component {
  state = {
    avatarURL: '',
    username: '',
    description: '',
    uid: '',
    currentUserProfile: true,
    modalVisible: false,
    modalSaving: false,
    modifiedUsername: '',
    modifiedDescription: '',
    modifiedAvatarURL: '',
    hasProfileChanged: false
  }

  componentWillMount() {
    const currentUserId =
      /* TODO: Use firebase.auth().currentUser.uid */ 'IpQAmwyyJrcnUpRq4p549T2M95S2'
    const profileId = this.props.navigation.getParam(
      /* TODO: Replace this with reasonable default and handle no ID */ 'uid',
      'IpQAmwyyJrcnUpRq4p549T2M95S2'
    )

    this.setState({
      avatarURL: '',
      username: 'Jenna97',
      description:
        'Avid Jeeper. Love bringing my dogs out into the wilderness, hiking, boating and fishing',
      uid: profileId,
      currentUserProfile: currentUserId == profileId,

      modifiedUsername: 'Jenna97',
      modifiedDescription:
        'Avid Jeeper. Love bringing my dogs out into the wilderness, hiking, boating and fishing',
      modifiedAvatarURL: ''
    })
  }

  setModalVisible(visible) {
    this.setState({
      modalVisible: visible,
      saveComplete: !visible
    })
  }

  setSaving(saving) {
    this.setState({ modalSaving: saving })
  }

  saveData() {
    // TODO
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
        onBackdropPress={() => this.setModalVisible(false)}
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={{ width: '100%', height: '100%' }}>
          <View style={{ padding: 12, backgroundColor: 'orange' }}>
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
              backgroundColor: 'grey',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              title={this.state.modalSaving ? 'Saving...' : 'Save Info'}
              loading={this.state.modalSaving}
              disabled={this.state.modalSaving}
              onPress={() => {
                console.table(this.state)
                const {
                  hasProfileChanged,
                  modifiedAvatarURL,
                  modifiedUsername,
                  modifiedDescription
                } = this.state
                if (hasProfileChanged) {
                  this.setSaving(true)
                  this.setModalVisible(true)
                  setTimeout(() => {
                    this.setModalVisible(false)
                    this.setSaving(false)
                    this.setState({
                      avatarURL: modifiedAvatarURL,
                      username: modifiedUsername,
                      description: modifiedDescription,
                      hasProfileChanged: false,
                      usernameChange: false,
                      descriptionChange: false
                    })
                  }, 1000)
                } else {
                  this.setModalVisible(false)
                }
              }}
            />
          </View>
        </View>
      </Modal>
    )
  }

  render() {
    return (
      <View style={styles.screen.container}>
        {this.modal()}
        {this.header()}
        {this.dogList()}
        {this.postsList()}
        {this.state.currentUserProfile && this.footerButtons()}
      </View>
    )
  }

  header() {
    return (
      <View style={styles.header.container}>
        <View style={styles.header.avatarContainer}>
          <RoundImage
            onPress={() => alert('Edit photo screen ---- TODO')}
            size={92}
            source={{
              uri:
                'https://firebasestorage.googleapis.com/v0/b/breed-up.appspot.com/o/IpQAmwyyJrcnUpRq4p549T2M95S2%2Fprofile-img?alt=media&token=aec0140f-e7a7-4cc4-972e-197627e609ee'
            }}
          />
        </View>
        <View style={styles.header.textAndButtonContainer}>
          <View style={styles.header.topRow}>
            <View style={styles.header.usernameContainer}>
              <Text
                onPress={() => this.setModalVisible(true)}
                style={styles.header.username}
              >
                {this.state.username}
              </Text>
            </View>
            <View style={styles.header.buttonContainer}>
              {!this.state.currentUserProfile && (
                <Button
                  buttonStyle={{
                    backgroundColor: Colors.dogBoneBlue
                  }}
                  title="Add to Pack"
                />
              )}
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text onPress={() => this.setModalVisible(true)}>
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
        <View style={styles.dogList.list}>
          <Text>Dog List Placeholder</Text>
        </View>
      </View>
    )
  }

  postsList() {
    return (
      <View style={styles.postList.container}>
        <View style={styles.postList.list}>
          <Text>Posts</Text>
        </View>
      </View>
    )
  }

  footerButtons() {
    return (
      <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <View style={styles.footer.buttonContainer}>
          <Button
            title="My Pack"
            buttonStyle={{ backgroundColor: Colors.dogBoneBlue }}
          />
        </View>
      </View>
    )
  }
}

const styles = {
  screen: StyleSheet.create({
    container: {
      backgroundColor: 'lightskyblue',
      flex: 1,
      paddingTop: 24
    }
  }),

  header: StyleSheet.create({
    container: {
      flexDirection: 'row',
      width: '100%'
    },
    avatarContainer: {},
    textAndButtonContainer: {
      flex: 1,
      paddingRight: 12
    },
    topRow: {
      justifyContent: 'space-between',
      flexDirection: 'row'
    },

    avatarContainer: {
      margin: 12,
      height: 92,
      width: 92
    },
    usernameContainer: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center'
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
      backgroundColor: 'lightgrey',
      height: 90,
      width: '100%'
    },
    list: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'lightgoldenrodyellow'
    }
  }),

  postList: StyleSheet.create({
    container: {
      backgroundColor: Colors.crimson,
      flex: 1,
      padding: 12
    },
    list: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'lightcyan'
    }
  }),

  footer: StyleSheet.create({
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: 'white',
      padding: 16
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
