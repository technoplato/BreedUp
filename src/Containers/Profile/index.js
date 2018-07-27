import React from 'react'
import { View, Text } from 'react-native'
import { Avatar, Button } from 'react-native-elements'
import firebase from 'react-native-firebase'

import styles from './ProfileScreenStyles'

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props)

    this.currentUser = firebase.auth().currentUser
    this.longPlacholder =
      'aklsdfjl;aksdfj;alsdfjk;alsdkfj;alsdkfj;alsdkfj;alskdfjl;asdkfj;alskdjf;lasdjf;laskjdf;lakjsdfl;kajsdfl;kjas;ldfkjadsl;fkjals;dfkjas;ldkfjals;dkfjals;dfjadls;fjk;laksdjf;laksjdf;laksdjf'

    this.state = {
      profileURL: '',
      username: '',
      description: '',
      dogs: [],
      posts: []
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderProfileHeader()}
        {this.renderTheRest()}
      </View>
    )
  }

  renderTheRest = () => {
    return <View style={{ flex: 1, backgroundColor: 'red' }} />
  }

  renderProfileHeader = () => {
    const { profileURL, username, description } = this.state

    return (
      <View style={styles.profileHeaderContainer}>
        <View style={styles.avatarContainer}>
          <Avatar
            rounded
            size={700}
            source={{
              uri:
                profileURL || 'https://dummyimage.com/60x60/000/fff.jpg&text=1'
            }}
          />
        </View>
        <View style={styles.textAndButtonContainer}>
          <View style={styles.usernameAndButtonContainer}>
            <Text style={styles.username}>
              {username || 'Placholder username'}
            </Text>
            <Button title="Add to Pack" buttonStyle={styles.button} />
          </View>
          <Text style={styles.description}>
            {description || 'Placholder description'}
          </Text>
        </View>
      </View>
    )
  }
}
