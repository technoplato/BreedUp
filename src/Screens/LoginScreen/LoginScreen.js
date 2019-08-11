import React from "react"
import { Text, TextInput, View, AsyncStorage } from "react-native"
import Button from "react-native-button"
import firebase from "react-native-firebase"
import AppStyles from "../../AppStyles"
import styles from "./styles"

const FBSDK = require("react-native-fbsdk")

const { LoginManager, AccessToken } = FBSDK

class LoginScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      email: "flo@gmail.com",
      password: "parola"
    }
    this.FCM = firebase.messaging()
    this.ref = firebase.firestore().collection("users")
  }

  onPressLogin = () => {
    const self = this
    const { email, password } = this.state

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        const { navigation } = this.props
        user_uid = response.user._user.uid
        self.ref
          .doc(user_uid)
          .get()
          .then(function(user) {
            if (user.exists) {
              self.storeFCMToken(user_uid)
              const loggedInUserData = { isloggedIn: true, user: user.data() }
              AsyncStorage.setItem("@loggedInUserID:id", user_uid)
              AsyncStorage.setItem("@loggedInUserID:key", email)
              AsyncStorage.setItem("@loggedInUserID:password", password)
              AsyncStorage.setItem(
                "@isUserloggedIn:value",
                JSON.stringify(loggedInUserData)
              )
              navigation.dispatch({ type: "Login", user })
            } else {
              alert("User does not exist. Please try again.")
            }
          })
          .catch(function(error) {
            const { code, message } = error
            alert(message)
          })
      })
      .catch(error => {
        const { code, message } = error
        alert(message)
        console.log(message)
        // For details of error codes, see the docs
        // The message contains the default Firebase string
        // representation of the error
      })
  }

  onPressFacebook = () => {
    const self = this

    LoginManager.logInWithReadPermissions([
      "public_profile",
      "user_friends",
      "email"
    ]).then(
      result => {
        if (result.isCancelled) {
          alert("Whoops!", "You cancelled the sign in.")
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            const credential = firebase.auth.FacebookAuthProvider.credential(
              data.accessToken
            )
            const { accessToken } = data
            firebase
              .auth()
              .signInWithCredential(credential)
              .then(result => {
                const { user } = result
                const loggedInUserData = { isloggedIn: true, user }
                AsyncStorage.setItem(
                  "@isUserloggedIn:value",
                  JSON.stringify(loggedInUserData)
                )
                AsyncStorage.setItem(
                  "@loggedInUserID:facebookCredentialAccessToken",
                  accessToken
                )
                AsyncStorage.setItem("@loggedInUserID:id", user.uid)
                const userDict = {
                  id: user.uid,
                  fullname: user.displayName,
                  email: user.email,
                  profileURL: user.photoURL
                }
                const data = {
                  ...userDict,
                  appIdentifier: "rn-android-messenger"
                }
                self.ref.doc(user.uid).set(data)
                self.storeFCMToken(user.uid)
                self.props.navigation.dispatch({
                  type: "Login",
                  user: userDict
                })
              })
              .catch(error => {
                alert(`Please try again! ${error}`)
              })
          })
        }
      },
      error => {
        Alert.alert("Sign in error", error)
      }
    )
  }

  storeFCMToken = userId => {
    const self = this

    self.FCM.hasPermission().then(enabled => {
      if (enabled) {
        // user has permissions
        self.FCM.getToken().then(token => {
          console.log("token====token", token)
          self.ref.doc(userId).update({ pushToken: token })
        })
      } else {
        // user doesn't have permission
        self.FCM.requestPermission().then(() => {
          // User has authorised
          self.FCM.getToken().then(token => {
            console.log("token====token", token)
            self.ref.doc(userId).update({ pushToken: token })
          })
        })
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, styles.leftTitle]}>Sign In</Text>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="E-mail or phone number"
            onChangeText={text => this.setState({ email: text })}
            value={this.state.email}
            placeholderTextColor={AppStyles.colorSet.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            secureTextEntry
            placeholder="Password"
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
            placeholderTextColor={AppStyles.colorSet.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <Button
          containerStyle={styles.loginContainer}
          style={styles.loginText}
          onPress={() => this.onPressLogin()}
        >
          Log in
        </Button>
        <Text style={styles.or}>OR</Text>
        <Button
          containerStyle={styles.facebookContainer}
          style={styles.facebookText}
          onPress={() => this.onPressFacebook()}
        >
          Login with Facebook
        </Button>
      </View>
    )
  }
}

export default LoginScreen
