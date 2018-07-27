import React, { PureComponent } from 'react'
import { View, Text } from 'react-native'
import { DrawerItems } from 'react-navigation'
import firebase from 'react-native-firebase'
import { Button } from 'react-native-elements'

class DrawerContent extends PureComponent {
  render() {
    const { currentUser } = firebase.auth()

    return (
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 32, paddingTop: 32, alignSelf: 'center' }}>
          Hi {currentUser && currentUser.displayName}!
        </Text>
        <DrawerItems {...this.props} />

        <View
          style={{
            justifyContent: 'space-between',
            flex: 1,
            paddingVertical: 24
          }}
        >
          <Button title="Add Post" onPress={this.addPost} />
          <Button title="Log Out" onPress={this.handleLogout} />
        </View>
      </View>
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
      author_img:
        'https://firebasestorage.googleapis.com/v0/b/breed-up.appspot.com/o/9sTu43Uw42cGiSMnwroraEDvqfu2%2Fprofile-img?alt=media&token=539cdada-a9b9-41b6-ac22-13cd51698dfd',
      time_posted: new Date().getTime(),
      reverse_timestamp: -1 * new Date().getTime(),
      text:
        'My dog is the best dog in the entire world and I want this post to be long enough to be a few lines',
      key: ref.key
    })
  }

  handleLogout = () => {
    firebase.auth().signOut()
    this.props.navigation.navigate('SignUp')
  }
}

export default DrawerContent
