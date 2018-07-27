import React from 'react'
import { View, Text } from 'react-native'
import firebase from 'react-native-firebase'

import styles from './AddPostScreenStyles'

export default class AddPostScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Add Post Screen Placeholder</Text>
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
}
