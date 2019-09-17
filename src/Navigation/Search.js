import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import { Icon } from 'react-native-elements'

import Search from 'screens/SearchScreen'
import Profile from 'screens/ProfileScreen'
import AddDogScreen from 'screens/AddDogScreen'
import DogDetailsScreen from 'screens/DogDetailsScreen'

export default createStackNavigator({
  Search: {
    screen: Search
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
  },
  AddDog: {
    screen: AddDogScreen
  },
  ViewDog: {
    screen: DogDetailsScreen
  }
})
