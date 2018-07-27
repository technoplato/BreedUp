import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { Icon } from 'react-native-elements'

import Profile from '../../Containers/Profile'
import Meetup from '../../Containers/Meetup'
import AddPost from '../../Containers/AddPost'

//https://github.com/react-navigation/react-navigation/issues/190 <-- follow this

const navigationOptions = ({ navigation }) => ({
  headerLeft: (
    <Icon
      containerStyle={{ marginLeft: 12 }}
      name="menu"
      color="#000"
      onPress={() => navigation.toggleDrawer()}
    />
  )
})

const RootStack = createStackNavigator(
  {
    Profile: {
      screen: Profile
    },
    Meetup: {
      screen: Meetup
    },
    'Add Post': {
      screen: AddPost
    }
  },
  {
    navigationOptions: navigationOptions
  }
)

export default RootStack
