import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { Icon } from 'react-native-elements'
import firebase from 'react-native-firebase'
import { Text } from 'react-native'

import Profile from '../../Containers/Profile'
import AddPost from '../../Containers/AddPost'
import AddDog from '../../Containers/AddDog'
import ViewDog from '../../Containers/ViewDog'

const ProfileStack = createStackNavigator({
  PrivateProfile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      headerLeft: (
        <Text
          style={{ marginLeft: 12 }}
          onPress={() => firebase.auth().signOut()}
        >
          Sign Out
        </Text>
      )
    })
  },
  AddDog: {
    screen: AddDog
  },
  ViewDog: {
    screen: ViewDog
  }
})

export { ProfileStack, AddPost }
