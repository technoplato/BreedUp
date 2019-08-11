import React from "react"
import { AsyncStorage, Text, TextInput, View } from "react-native"
import Button from "react-native-button"
import firebase from "react-native-firebase"
// import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import styles from "./styles"

class SignupScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      fullname: "John smith",
      phone: "111",
      email: "jhon@gmail.com",
      password: "111111"
    }
    this.FCM = firebase.messaging()
    this.ref = firebase.firestore().collection("users")
  }

  componentDidMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged(user => {
      this.setState({
        loading: false,
        user
      })
    })
  }

  componentWillUnmount() {
    this.authSubscription()
  }

  onRegister = () => {
    const self = this
    const { email, password } = this.state
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        const { navigation } = this.props
        user_uid = response.user._user.uid

        const { fullname, phone, email } = this.state
        const data = {
          email,
          firstName: fullname,
          phone,
          userID: user_uid,
          appIdentifier: "rn-messenger-android",
          profilePictureURL:
            "https://www.instamobile.io/wp-content/uploads/2019/05/default-avatar.jpg"
        }
        firebase
          .firestore()
          .collection("users")
          .doc(user_uid)
          .set(data)
        firebase
          .firestore()
          .collection("users")
          .doc(user_uid)
          .get()
          .then(function(user) {
            const loggedInUserData = { isloggedIn: true, user: user.data() }
            self.storeFCMToken(user_uid)
            AsyncStorage.setItem(
              "@isUserloggedIn:value",
              JSON.stringify(loggedInUserData)
            )
            navigation.dispatch({
              type: "Login",
              user: { ...user.data(), id: user.id }
            })
          })
          .catch(function(error) {
            const { code, message } = error
            alert(message)
          })
      })
      .catch(error => {
        const { code, message } = error
        alert(message)
      })
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
        <Text style={[styles.title, styles.leftTitle]}>Create new account</Text>
        <KeyboardAwareScrollView style={{ flex: 1, width: "100%" }}>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              placeholder="Full Name"
              onChangeText={text => this.setState({ fullname: text })}
              value={this.state.fullname}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              placeholder="Phone Number"
              onChangeText={text => this.setState({ phone: text })}
              value={this.state.phone}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              placeholder="E-mail Address"
              onChangeText={text => this.setState({ email: text })}
              value={this.state.email}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              placeholder="Password"
              secureTextEntry
              onChangeText={text => this.setState({ password: text })}
              value={this.state.password}
              underlineColorAndroid="transparent"
            />
          </View>
          <Button
            containerStyle={[styles.facebookContainer, { marginTop: 50 }]}
            style={styles.facebookText}
            onPress={() => this.onRegister()}
          >
            Sign Up
          </Button>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

export default SignupScreen
