import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { Icon } from 'react-native-elements'

import Profile from '../../Containers/Profile'
import Meetup from '../../Containers/Meetup'
import AddPost from '../../Containers/AddPost'

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

const ProfileStack = createStackNavigator({
    Profile: {
        screen: Profile,
        navigationOptions: navigationOptions
    }
})

const MeetupStack = createStackNavigator({
    Meetup: {
        screen: Meetup,
        navigationOptions: navigationOptions
    }
})

const AddPostStack = createStackNavigator({
  AddPost: {
    screen: AddPost,
    navigationOptions: navigationOptions
  }
})

export {
    ProfileStack, MeetupStack, AddPostStack
}
