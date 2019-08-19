import React from "react"
import { Alert, View } from "react-native"

import FeedList from "../Components/FeedList"
import styles from "../Styles/FeedScreenStyles"
import firebase from "react-native-firebase"

export default class Main extends React.Component {
  static navigationOptions = {
    header: null
  }

  async componentDidMount() {
    const notificationDidOpenApp = await this.handleInitialNotification()
    if (notificationDidOpenApp) {
      this.props.navigation.navigate("NotificationChatHome")
    }
    this.listenForNotificationTokenRefresh()
    this.setupNotificationPermissions()
  }

  async handleInitialNotification() {
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification()
    if (notificationOpen) {
      // App was opened by a notification
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action
      // Get information about the notification that was opened
      const notification = notificationOpen.notification
      console.log("action", action)
      console.log("notification", notification)
    }
    return !!notificationOpen
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
    } catch (error) {
      console.log(error)
    }
  }

  beginListeningForNotifications() {
    this.removeNotificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed(notification => {
        console.log("onNotificationDisplayed")
        console.log(notification)
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        const { title, body } = notification
        this.showAlert(title, body)
      })
    this.removeNotificationListener = firebase
      .notifications()
      .onNotification(notification => {
        console.log("onNotification")
        console.log(notification)

        // Process your notification as required
        notification.android.setChannelId("test-channel")
        const { title, body } = notification
        this.showAlert(title, body)
      })

    this.removeNotificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        console.log("onNotificationOpened")
        // Get the action triggered by the notification being opened
        const { action } = notificationOpen
        // Get information about the notification that was opened
        const { notification } = notificationOpen
        console.log(notification)
      })
  }
  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      {
        cancelable: false
      }
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <FeedList navigation={this.props.navigation} />
      </View>
    )
  }
}
