import React from 'react'
import { Text, TextInput, View, Alert, ImageBackground } from 'react-native'
import { Button } from 'react-native-elements'

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import styles from './SignUpStyles'
import { Images } from '../Themes'

const removeFuncs = obj => JSON.parse(JSON.stringify(obj))

export default class SignUpScreen extends React.Component {
  state = { email: '', password: '', username: '', errorMsg: null }

  componentDidMount = () => {
    if (this.props.navigation.state.params !== undefined) {
      const { email, password } = this.props.navigation.state.params
      this.setState({
        email: email || '',
        password: password || ''
      })
    }
  }

  handleSignUp = () => {
    let { email, password, username } = this.state
    let userData
    if (!email) {
      this.setState({ errorMsg: 'Please enter a valid email.' })
    } else if (!password) {
      this.setState({ errorMsg: 'Please enter a valid password.' })
    } else if (!username) {
      this.setState({ errorMsg: 'Please enter a valid username.' })
    } else {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(userRecord => {
          const user = removeFuncs(userRecord.user)
          firestore()
            .collection('users')
            .doc(user.uid)
            .set({
              ...user,
              dogs: [],
              description: '',
              username: username,
              lowercaseUsername: username.toLocaleLowerCase(),
              photoURL:
                'https://www.instamobile.io/wp-content/uploads/2019/05/default-avatar.jpg'
            })
        })
        .then(() => this.props.navigation.navigate('Feed'))
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
            [{ text: 'Ok' }]
          )
        })
        .catch(function(error) {
          Alert.alert(
            'An error occurred sending email',
            'Please email support for help.',
            [{ text: 'Ok' }]
          )
        })
    }
  }

  render() {
    return (
      <ImageBackground
        blurRadius={10}
        source={Images.blackDog}
        style={styles.container}
      >
        <Text
          onLongPress={() => {
            auth()
              .signInWithEmailAndPassword('halfjew22@gmail.com', 'aaaaaa')
              .then(userRecord => {
                const user = removeFuncs(userRecord.user)
                firestore()
                  .collection('users')
                  .doc(user.uid)
                  .set(
                    {
                      ...user,
                      username: user.displayName,
                      lowercaseUsername: user.displayName.toLocaleLowerCase(),
                      photoURL: user.photoURL
                    },
                    { merge: true }
                  )
              })
              .then(() => this.props.navigation.navigate('Feed'))
              .catch(error => this.setState({ errorMsg: error.message }))
          }}
          style={styles.headerText}
        >
          Breed Up
        </Text>
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
      </ImageBackground>
    )
  }
}
