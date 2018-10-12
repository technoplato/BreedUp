import React from 'react'
import { createStackNavigator } from 'react-navigation'
import firebase from 'react-native-firebase'
import { Text } from 'react-native'

import Search from '../../Containers/Search'
import AddPost from '../../Containers/AddPost'
import Profile from '../../Containers/Profile'
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

const SearchStack = createStackNavigator({
  Search: {
    screen: Search
  }
})

export { ProfileStack, AddPost, SearchStack }
