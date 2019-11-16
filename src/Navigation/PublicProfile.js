import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'

import Profile from 'screens/ProfileScreen'
import AddDogScreen from 'screens/AddDogScreen'
import DogDetailsScreen from 'screens/DogDetailsScreen'
import ChatHomeScreen from 'screens/ChatHomeScreen/ChatHomeScreen'
import ChatScreen from 'screens/ChatScreen/ChatScreen'
import CommentsScreen from 'screens/CommentsScreen'
import Back from 'components/Back'

export default createStackNavigator(
  {
    PublicProfile: {
      screen: Profile,
      navigationOptions: ({ navigation }) => {
        console.log('L17 navigation.state.params ===', navigation.state.params)
        return {
          title: `${navigation.state.params.username}'s Profile`
        }
      }
    },
    Comments: {
      screen: CommentsScreen,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.post.author.username}'s Post`
      })
    },
    ProfileChatHome: {
      screen: ChatHomeScreen
    },
    Chat: {
      screen: ChatScreen
    },
    AddDog: {
      screen: AddDogScreen,
      navigationOptions: {
        title: 'Add Your Good Girl or Boy!'
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
  },
  {
    defaultNavigationOptions: {
      headerLeft: <Back />
    }
  }
)
