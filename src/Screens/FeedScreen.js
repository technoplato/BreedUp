import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'

import styles from '../Styles/FeedScreenStyles'
import firebase from '@react-native-firebase/app'
import '@react-native-firebase/database'
import '@react-native-firebase/firestore'
import '@react-native-firebase/auth'
import PostsList from '../Components/PostsList'
import { Images } from '../Themes'
import AppStyles from '../AppStyles'

export default class FeedScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          flexDirection: 'row',
          height: 80,
          paddingTop: 24
        }}
      >
        <View style={{ width: 24, height: 24 }} />

        <Image
          style={{ height: 64, width: 64, marginTop: 12 }}
          source={Images.iconFeed}
        />
        <Icon
          containerStyle={{ marginRight: 12 }}
          name="chat"
          color="#000"
          onPress={() => navigation.navigate('ChatHome')}
        />
      </View>
    )
  })

  render() {
    return (
      <View style={styles.container}>
        <PostsList navigation={this.props.navigation} />
      </View>
    )
  }
}

/*



  async componentDidMount() {
    // this.handleInitialNotification()
    // this.listenForNotificationTokenRefresh()
    // this.setupNotificationPermissions()
  }

  async handleInitialNotification() {
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification()
    if (notificationOpen) {
      // App was opened by a notification
      const notification = notificationOpen.notification
      this.props.navigation.navigate('Chat', {
        channel: {
          fromDeepLink: true,
          id: notification.data.channelId
        }
      })
    }
  }

  listenForNotificationTokenRefresh() {
    this.removeTokenRefreshListener = firebase
      .messaging()
      .onTokenRefresh(this.onTokenRefresh)
  }

  async setupNotificationPermissions() {
    const enabled = await firebase.messaging().hasPermission()
    if (!enabled) {
      this.askForNotificationPermissions()
    }
  }

  onTokenRefresh = token => {
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .update({ pushToken: token })
    this.beginListeningForNotifications()
  }

  componentWillUnmount() {
    // TODO watch invertase until they release notifications on rnfb6
    // this.removeNotificationDisplayedListener()
    // this.removeNotificationListener()
    // this.removeNotificationOpenedListener()
    // this.removeTokenRefreshListener()
  }

  async askForNotificationPermissions() {
    try {
      await firebase.messaging().requestPermission()
    } catch (error) {}
  }

  beginListeningForNotifications() {
    this.removeNotificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed(notification => {
        // No op
      })
    this.removeNotificationListener = firebase
      .notifications()
      .onNotification(notification => {
        if (global.activeChatChannelId === notification.data.channelId) return

        // Process your notification as required
        notification.android.setChannelId('test-channel')

        firebase.notifications().displayNotification(notification)
      })

    this.removeNotificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const { notification } = notificationOpen
        if (notification.title.includes('New message')) {
          this.props.navigation.navigate('Chat', {
            channel: {
              fromDeepLink: true,
              id: notification.data.channelId
            }
          })
        } else if (notification.title.includes('New Friend Request')) {
          this.props.navigation.navigate('ChatHome')
        }
      })
  }

 */
