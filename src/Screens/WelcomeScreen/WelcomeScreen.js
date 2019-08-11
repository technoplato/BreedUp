import React from "react"
import Button from "react-native-button"
import { Text, View, AsyncStorage, ActivityIndicator } from "react-native"
import firebase from "react-native-firebase"
import AppStyles from "../../AppStyles"
import styles from "./styles"

class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }

  async componentWillMount() {
    this.tryToLoginFirst()
    const id = await AsyncStorage.getItem("@loggedInUserID:id")
    AsyncStorage.getItem("@isUserloggedIn:value", (err, resultUnparsed) => {
      const result = JSON.parse(resultUnparsed)
      if (result !== null) {
        const dict = {
          id: result.user.userId ? result.user.userId : id,
          email: result.user.email,
          profileURL: result.user.proilePictureUrl,
          fullname: result.user.fullname
        }
        this.setState({ isLoading: false }, () => {
          this.props.navigation.dispatch({
            type: "Login",
            user: dict
          })
        })
      }
    })
  }

  async tryToLoginFirst() {
    const email = await AsyncStorage.getItem("@loggedInUserID:key")
    const password = await AsyncStorage.getItem("@loggedInUserID:password")
    const id = await AsyncStorage.getItem("@loggedInUserID:id")
    if (
      id != null &&
      id.length > 0 &&
      password != null &&
      password.length > 0
    ) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => {
          const { navigation } = this.props
          firebase
            .firestore()
            .collection("users")
            .doc(id)
            .get()
            .then(function(doc) {
              const dict = {
                ...doc.data(),
                id
                // email,
                // profileURL: doc.photoURL,
                // fullname: doc.displayName,
              }
              if (doc.exists) {
                navigation.dispatch({ type: "Login", user: dict })
              }
            })
            .catch(function(error) {
              const { code, message } = error
              alert(message)
            })
          this.setState({ isLoading: false })
        })
        .catch(error => {
          const { code, message } = error
          alert(message)
          // For details of error codes, see the docs
          // The message contains the default Firebase string
          // representation of the error
        })
      return
    }
    const fbToken = await AsyncStorage.getItem(
      "@loggedInUserID:facebookCredentialAccessToken"
    )
    if (id != null && id.length > 0 && fbToken != null && fbToken.length > 0) {
      const credential = firebase.auth.FacebookAuthProvider.credential(fbToken)
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(result => {
          const { user } = result
          const userDict = {
            id: user.uid,
            fullname: user.displayName,
            email: user.email,
            profileURL: user.photoURL
          }
          this.props.navigation.dispatch({
            type: "Login",
            user: userDict
          })
        })
        .catch(error => {
          this.setState({ isLoading: false })
        })
      return
    }
    this.setState({ isLoading: false })
  }

  render() {
    if (this.state.isLoading == true) {
      return (
        <ActivityIndicator
          style={styles.spinner}
          size="large"
          color={AppStyles.colorSet.tint}
        />
      )
    }
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Say hello to your new messaging app</Text>
        <Button
          containerStyle={styles.loginContainer}
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate("Login")}
        >
          Log In
        </Button>
        <Button
          containerStyle={styles.signupContainer}
          style={styles.signupText}
          onPress={() => this.props.navigation.navigate("Signup")}
        >
          Sign Up
        </Button>
      </View>
    )
  }
}

export default WelcomeScreen
