import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'

import FeedScreen from 'screens/FeedScreen'
import ChatHomeScreen from 'screens/ChatHomeScreen/ChatHomeScreen'
import ChatScreen from 'screens/ChatScreen/ChatScreen'
import CommentsScreen from 'screens/CommentsScreen'
import PublicProfileStack from './PublicProfile'
import DogDetailsScreen from 'screens/DogDetailsScreen'

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
    screen: PublicProfileStack,
    navigationOptions: {
      header: null
    }
  },
  ViewDog: {
    screen: DogDetailsScreen,
    navigationOptions: ({ navigation }) => {
      const { dog } = navigation.state.params
      const title = `${dog.name} the ${dog.breed}!`
      return {
        title
      }
    }
  }
})
