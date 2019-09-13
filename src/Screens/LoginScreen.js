import React from 'react'
import { Text, TextInput, Alert, ImageBackground } from 'react-native'

import { Button } from 'react-native-elements'

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import styles from './LoginStyles'
import { Images } from '../Themes'

const removeFuncs = obj => JSON.parse(JSON.stringify(obj))

export default class Login extends React.Component {
  state = { email: '', password: '', errorMsg: null }

  componentDidMount = () => {
    if (this.props.navigation.state.params !== undefined) {
      const { email, password } = this.props.navigation.state.params
      this.setState({
        email: email || '',
        password: password || ''
      })
    }
  }

  handleLogin = () => {
    const { email, password } = this.state

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(userRecord => {
        const user = removeFuncs(userRecord.user)
        console.log(user)
        firestore()
          .collection('users')
          .doc(user.uid)
          .update({
            user
          })
      })
      .then(() => this.props.navigation.navigate('Feed'))
      .catch(error => this.setState({ errorMsg: error.message }))
  }

  handlePasswordReset = () => {
    const { email } = this.state

    if (!email) {
      const errorMsg =
        'Please enter an email that we can send a password reset link to.'

      this.setState({ errorMsg })
    } else {
      auth()
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
            console.log('"long press"')
            auth()
              .signInWithEmailAndPassword('halfjew22@gmail.com', 'aaaaaa')
              .then(userRecord => {
                const user = removeFuncs(userRecord.user)
                console.log(user)
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
          <Text style={{ color: 'white', padding: 12 }}>
            {this.state.errorMsg}
          </Text>
        )}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          keyboardType={'email-address'}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={pw => this.setState({ password: pw })}
          onSubmitEditing={this.handleLogin}
          value={this.state.password}
        />
        <Button
          buttonStyle={styles.button}
          title="Login"
          onPress={this.handleLogin}
        />
        <Button
          buttonStyle={styles.button}
          title="Don't have an account? Sign Up"
          onPress={() => {
            const { email, password } = this.state

            this.props.navigation.navigate('SignUp', { email, password })
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
