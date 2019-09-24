import React from 'react'
import { View } from 'react-native'
import { createStackNavigator } from 'react-navigation-stack'
import { Icon } from 'react-native-elements'
import auth from '@react-native-firebase/auth'

import Profile from 'screens/ProfileScreen'
import AddDogScreen from 'screens/AddDogScreen'
import DogDetailsScreen from 'screens/DogDetailsScreen'
import ChatHomeScreen from 'screens/ChatHomeScreen/ChatHomeScreen'
import ChatScreen from 'screens/ChatScreen/ChatScreen'
import CommentsScreen from 'screens/CommentsScreen'

import NavigatorService from '../services/navigator'
import Back from 'components/Back'

export default createStackNavigator(
  {
    PrivateProfile: {
      screen: Profile,
      navigationOptions: ({ navigation }) => ({
        title: 'YOUR PROFILE',
        headerLeft: null,
        headerRight: (
          <View style={{ flexDirection: 'row' }}>
            <Icon
              containerStyle={{ marginRight: 12 }}
              name="chat"
              color="#000"
              onPress={() => navigation.navigate('ProfileChatHome')}
            />
            <Icon
              onPress={() =>
                auth()
                  .signOut()
                  .then(() => NavigatorService.navigate('Login'))
              }
              containerStyle={{ marginRight: 12 }}
              name="input"
              color="#000"
            />
          </View>
        )
      })
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
