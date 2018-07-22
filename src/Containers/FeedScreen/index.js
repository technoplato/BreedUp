import React from 'react'
import { View, Image, Text } from 'react-native'
import firebase from 'react-native-firebase'
import { Card, Button, ListItem, Icon } from 'react-native-elements'

import styles from './FeedScreenStyles'

export default class Main extends React.Component {
  state = { currentUser: null }

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
  }

  handleLogout = () => {
    firebase.auth().signOut()
    this.props.navigation.navigate('SignUp')
  }

  render() {
    const users = [
      {
        name: 'brynn',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
      },
      {
        name: 'brynn',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
      },
      {
        name: 'brynn',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
      },
      {
        name: 'brynn',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
      },
      {
        name: 'brynn',
        avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
      }
    ]
    const { currentUser } = this.state

    console.log(currentUser)

    return (
      <View style={styles.container}>
        <Text>Hi {currentUser && currentUser.displayName}!</Text>
        <Button title="Log Out" onPress={this.handleLogout} />

        <Card
          title="Card"
          image={{
            uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
          }}
        >
          <Text style={{ marginBottom: 10 }}>
            The idea with React Native Elements is more about component
            structure than actual design.
          </Text>
          <Button
            icon={<Icon name="code" color="#ffffff" />}
            backgroundColor="#03A9F4"
            buttonStyle={{
              borderRadius: 0,
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 0
            }}
            title="VIEW NOW"
          />
        </Card>
      </View>
    )
  }
}
