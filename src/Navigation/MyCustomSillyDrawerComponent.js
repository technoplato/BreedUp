import React, { PureComponent } from 'react'
import { View, Text } from 'react-native'
import { DrawerItems } from 'react-navigation'
import firebase from 'react-native-firebase'
import { Button } from 'react-native-elements'

import { Colors } from '../Themes'

class DrawerContent extends PureComponent {
  render() {
    const { currentUser } = firebase.auth()

    return (
      <View style={{ flex: 1 }}>
        <Text
          style={{
            width: '100%',
            backgroundColor: Colors.crimson,
            height: 160,
            paddingTop: 70,
            color: 'white',
            textAlign: 'center',
            alignSelf: 'center',
            textAlignVertical: 'center',
            fontSize: 32
          }}
        >
          Hi {currentUser && currentUser.displayName}!
        </Text>

        <DrawerItems {...this.props} />

        <View
          style={{
            justifyContent: 'flex-end',
            flex: 1,
            paddingVertical: 24
          }}
        >
          <Button title="Log Out" onPress={this.handleLogout} />
        </View>
      </View>
    )
  }
  
  handleLogout = () => {
    firebase.auth().signOut()
    this.props.navigation.navigate('SignUp')
  }
}

export default DrawerContent
