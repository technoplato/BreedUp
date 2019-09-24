import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import { Icon } from 'react-native-elements'

import Search from 'screens/SearchScreen'
import Profile from 'screens/ProfileScreen'
import AddDogScreen from 'screens/AddDogScreen'
import DogDetailsScreen from 'screens/DogDetailsScreen'
import Back from '../Components/Back'

export default createStackNavigator(
  {
    Search: {
      screen: Search,
      navigationOptions: {
        headerLeft: null
      }
    },
    PublicProfile: {
      screen: Profile,
      navigationOptions: ({ navigation }) => ({
        headerVisible: 'false',
        title: `${navigation.state.params.username}'s Profile`
      })
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
