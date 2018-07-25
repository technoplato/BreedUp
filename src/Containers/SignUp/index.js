import React from 'react'
import {
  Text,
  TextInput,
  View,
  Alert,
  ImageBackground,
  Image
} from 'react-native'
import { Button } from 'react-native-elements'
import firebase from 'react-native-firebase'

import styles from './SignUpStyles'
import { Images } from '../../Themes'

export default class SignUp extends React.Component {
  state = { email: '', password: '', username: '', errorMsg: null }

  componentDidMount = () => {
    console.log(this.props.navigation.state.params)
    if (this.props.navigation.state.params !== undefined) {
      const { email, password } = this.props.navigation.state.params
      this.setState({
        email: email || '',
        password: password || ''
      })
    }
  }

  handleSignUp = () => {
    const { email, password, username } = this.state

    if (!email) {
      this.setState({ errorMsg: 'Please enter a valid email.' })
    } else if (!password) {
      this.setState({ errorMsg: 'Please enter a valid password.' })
    } else if (!username) {
      this.setState({ errorMsg: 'Please enter a valid username.' })
    } else {
      firebase
        .auth()
        .createUserAndRetrieveDataWithEmailAndPassword(email, password)
        .then(data => {
          return firebase
            .database()
            .ref('users')
            .child(data.user.uid)
            .set({
              username: username,
              displayName: data.user.displayName,
              email: data.user.email,
              emailVerified: data.user.emailVerified,
              photoURL: data.user.photoURL,
              uid: data.user.uid,
              metadata: data.user.metadata
            })
        })
        .then(() => {
          return firebase.auth().currentUser.updateProfile({
            displayName: username
          })
        })
        .then(() => this.props.navigation.navigate('ChooseImage'))
        .catch(error => {
          this.setState({ errorMsg: error.message })
        })
    }
  }

  handlePasswordReset = () => {
    const { email } = this.state

    if (!email) {
      const errorMsg =
        'Please enter an email that we can send a password reset link to.'

      this.setState({ errorMsg })
    } else {
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(function() {
          Alert.alert(
            'Reset password email sent',
            'Please check your email to reset your password.',
            [{ text: 'Ok', onPress: () => console.log('Ok pressed') }]
          )
        })
        .catch(function(error) {
          Alert.alert(
            'An error occurred sending email',
            'Please email support for help.',
            [{ text: 'Ok', onPress: () => console.log('Ok pressed') }]
          )
        })
    }
  }

  render() {
    return (
      <ImageBackground
        source={Images.onboardingBackground}
        style={styles.container}
      >
        <Text style={styles.headerText}>Breed Up</Text>
        {this.state.errorMsg && (
          <Text style={{ color: 'white', padding: 24 }}>
            {this.state.errorMsg}
          </Text>
        )}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          keyboardType={'email-address'}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <TextInput
          placeholder="Username"
          autoCapitalize="none"
          style={styles.textInput}
          onSubmitEditing={this.handleSignUp}
          onChangeText={username => this.setState({ username })}
          value={this.state.username}
        />
        <Button
          buttonStyle={styles.button}
          title="Sign Up"
          onPress={this.handleSignUp}
        />
        <Button
          buttonStyle={styles.button}
          title="Already have an account? Login"
          onPress={() => {
            const { email, password } = this.state

            this.props.navigation.navigate('Login', {
              email,
              password
            })
          }}
        />
        <Button
          buttonStyle={styles.button}
          title="Forgot your password?"
          onPress={this.handlePasswordReset}
        />
        <View style={styles.topBar}>
          <View style={styles.headerImage} />
        </View>
      </ImageBackground>
    )
  }
}
