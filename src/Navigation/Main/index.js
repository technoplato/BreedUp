import React from 'react'
import { createDrawerNavigator } from 'react-navigation'
import { Icon } from 'react-native-elements'

import Profile from '../../Containers/Profile'
import Meetup from '../../Containers/Meetup'
import AddPost from '../../Containers/AddPost'

import Misc from '../Misc'

import Feed from '../Feed'

import MyCustomSillyDrawerComponent from '../MyCustomSillyDrawerComponent'

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

const RootStack = createDrawerNavigator(
  {
    Main: {
      screen: Feed,
      navigationOptions: navigationOptions
    },
    Misc: {
      screen: Misc,
      navigationOptions: navigationOptions
    }
  },
  {
    initialRouteName: 'Main',
    contentComponent: MyCustomSillyDrawerComponent
  }
)

export default RootStack
