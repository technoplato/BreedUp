import React from "react"
import { View, Text } from "react-native"
import { Icon } from "react-native-elements"

import FeedList from "../Components/FeedList"
import styles from "../Styles/FeedScreenStyles"
import firebase from "react-native-firebase"

export default class FeedScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
          flexDirection: "row",
          height: 80,
          paddingTop: 24 /* only for IOS to give StatusBar Space */
        }}
      >
        <View style={{ width: 24, height: 24 }} />
        <Text style={{ fontSize: 32 }}>FEED</Text>
        <Icon
          containerStyle={{ marginRight: 12 }}
          name="chat"
          color="#000"
          onPress={() => navigation.navigate("ChatHome")}
        />
      </View>
    )
  })

  async componentDidMount() {
    this.handleInitialNotification()
    this.listenForNotificationTokenRefresh()
    this.setupNotificationPermissions()
  }

  async handleInitialNotification() {
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification()
    if (notificationOpen) {
      // App was opened by a notification
      const notification = notificationOpen.notification
      this.props.navigation.navigate("Chat", {
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
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({ pushToken: token })
    this.beginListeningForNotifications()
  }

  componentWillUnmount() {
    this.removeNotificationDisplayedListener()
    this.removeNotificationListener()
    this.removeNotificationOpenedListener()
    this.removeTokenRefreshListener()
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
        // Process your notification as required
        notification.android.setChannelId("test-channel")

        firebase.notifications().displayNotification(notification)
      })

    this.removeNotificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const { notification } = notificationOpen
        this.props.navigation.navigate("Chat", {
          channel: {
            fromDeepLink: true,
            id: notification.data.channelId
          }
        })
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <FeedList navigation={this.props.navigation} />
      </View>
    )
  }
}