import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'

import FeedScreen from 'screens/FeedScreen'
import ChatHomeScreen from 'screens/ChatHomeScreen/ChatHomeScreen'
import ChatScreen from 'screens/ChatScreen/ChatScreen'
import CommentsScreen from 'screens/CommentsScreen'
import ProfileScreen from 'screens/ProfileScreen'
import Back from 'components/Back'

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
      headerLeft: <Back />
    })
  },
  PublicProfile: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      headerVisible: 'false',
      title: `${navigation.state.params.username}'s Profile`,
      headerLeft: <Back />
    })
  }
})
