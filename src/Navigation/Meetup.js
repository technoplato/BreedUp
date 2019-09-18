import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import { Icon } from 'react-native-elements'

import CreateMeetupScreen from 'screens/CreateMeetupScreen'
import MeetupsScreen from 'screens/MeetupsScreen'
import MeetupDetailsScreen from 'screens/MeetupDetailsScreen'
import SearchAddressScreen from 'screens/SearchAddressScreen'
import SearchUserScreen from 'screens/SearchUserScreen'
import PickDateScreen from 'screens/PickDateScreen'

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
      navigationOptions: {
        title: `TODO: Set param on navigation to display as title`
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
    defaultNavigationOptions: ({ navigation }) => ({
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
)
