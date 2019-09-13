import React from 'react'
import { Icon } from 'react-native-elements'
import { createStackNavigator } from 'react-navigation'

import FeedScreen from '../../Screens/FeedScreen'
import CommentsScreen from '../../Screens/CommentsScreen'

import Profile from '../../Screens/ProfileScreen'
import ChatScreen from '../../Screens/ChatScreen/ChatScreen'
import ChatHomeScreen from '../../Screens/ChatHomeScreen/ChatHomeScreen'

export default createStackNavigator({
  Feed: {
    screen: FeedScreen
  },
  ChatHome: {
    screen: ChatHomeScreen
  },
  Chat: {
    screen: ChatScreen
  },
  Comments: {
    screen: CommentsScreen,
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.post.author.username}'s Post`,
      headerLeft: (
        <Icon
          containerStyle={{ marginLeft: 12 }}
          name="arrow-back"
          color="#000"
          onPress={() => navigation.goBack()}
        />
      )
    })
  },
  PublicProfile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      headerVisible: 'false',
      title: `${navigation.state.params.username}'s Profile`,
      headerLeft: (
        <Icon
          containerStyle={{ marginLeft: 12 }}
          name="arrow-back"
          color="#000"
          onPress={() => navigation.goBack()}
        />
      )
    })
  }
})
