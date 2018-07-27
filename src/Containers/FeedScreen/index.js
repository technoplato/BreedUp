import React from 'react'
import { View, Text } from 'react-native'
import firebase from 'react-native-firebase'
import { Button } from 'react-native-elements'

import FeedList from '../../Components/FeedList'
import styles from './FeedScreenStyles'

export default class Main extends React.Component {
  state = { currentUser: null }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({
      currentUser: currentUser
    })
  }

  addPost = () => {
    const ref = firebase
      .database()
      .ref()
      .child('posts')
      .push()

    ref.set({
      author: this.state.currentUser.displayName,
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

  render() {
    const { currentUser } = this.state

    return (
      <View style={styles.container}>
        <Text>Hi {currentUser && currentUser.displayName}!</Text>
        <Button title="Add Post" onPress={this.addPost} />

        <FeedList navigation={this.props.navigation} />

        <Button title="Log Out" onPress={this.handleLogout} />
      </View>
    )
  }
}
