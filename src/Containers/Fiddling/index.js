import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  TouchableHighlight
} from 'react-native'
import { Button } from 'react-native-elements'
import firebase from 'react-native-firebase'
import Modal from 'react-native-modal'

import RoundImage from '../../Components/RoundImageView'
import { Colors } from '../../Themes'

export default class Fiddling extends React.Component {
  state = {
    avatarURL: '',
    username: '',
    description: '',
    uid: '',
    currentUserProfile: true,
    modalVisible: false
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
      username: '',
      description: '',
      uid: profileId,
      currentUserProfile: currentUserId == profileId
    })
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible })
  }

  render() {
    return (
      <View style={styles.screen.container}>
        <Modal
          isVisible={this.state.modalVisible}
          onBackdropPress={() => this.setModalVisible(false)}
        >
          <View
            style={{
              alignSelf: 'center',
              height: 200,
              width: 300,
              backgroundColor: 'black'
            }}
          />
        </Modal>
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
                Username
              </Text>
            </View>
            <View style={styles.header.buttonContainer}>
              {!this.state.currentUserProfile && (
                <Button
                  buttonStyle={{ backgroundColor: Colors.dogBoneBlue }}
                  title="Add to Pack"
                />
              )}
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <TextInput
              value="Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical "
              multiline
              maxLength={120}
            />
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
          <Button
            title="Start Event"
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
      justifyContent: 'space-between',
      backgroundColor: 'white',
      padding: 16
    }
  })
}
