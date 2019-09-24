import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import { Icon } from 'react-native-elements'

import CreateMeetupScreen from 'screens/CreateMeetupScreen'
import MeetupsScreen from 'screens/MeetupsScreen'
import MeetupDetailsScreen from 'screens/MeetupDetailsScreen'
import ProfileScreen from 'screens/ProfileScreen'
import SearchAddressScreen from 'screens/SearchAddressScreen'
import SearchUserScreen from 'screens/SearchUserScreen'
import PickDateScreen from 'screens/PickDateScreen'
import Back from '../Components/Back'

export default createStackNavigator(
  {
    Meetups: {
      screen: MeetupsScreen,
      navigationOptions: {
        title: `Your Meetups`,
        headerLeft: null
      }
    },
    CreateMeetup: {
      screen: CreateMeetupScreen,
      navigationOptions: {
        title: `Create a Meetup`
      }
    },
    ViewMeetup: {
      screen: MeetupDetailsScreen,
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.title
      })
    },
    ViewUser: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => {
        const { username } = navigation.state.params
        const title = !!username ? `${username}'s Profile` : 'Loading...'
        return { title }
      }
    },
    SearchAddress: {
      screen: SearchAddressScreen,
      navigationOptions: {
        title: `Choose a Location!`
      }
    },
    SearchUser: {
      screen: SearchUserScreen,
      navigationOptions: {
        title: 'Invite a Friend!'
      }
    },
    PickTime: {
      screen: PickDateScreen,
      navigationOptions: {
        title: 'What Time works?'
      }
    }
  },
  {
    defaultNavigationOptions: {
      headerLeft: <Back />
    }
  }
)
