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

export default createStackNavigator({
  PrivateProfile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      title: 'YOUR PROFILE',
      headerRight: (
        <View style={{ flexDirection: 'row' }}>
          <Icon
            containerStyle={{ marginRight: 12 }}
            name="chat"
            color="#000"
            onPress={() => navigation.navigate('ProfileChatHome')}
          />
          <Icon
            onPress={() => auth().signOut()}
            containerStyle={{ marginRight: 12 }}
            name="input"
            color="#000"
          />
        </View>
      )
    })
  },
  ProfileChatHome: {
    screen: ChatHomeScreen
  },
  Chat: {
    screen: ChatScreen
  },
  AddDog: {
    screen: AddDogScreen
  },
  ViewDog: {
    screen: DogDetailsScreen
  }
})