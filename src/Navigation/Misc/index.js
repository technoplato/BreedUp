import React from "react"
import { createStackNavigator } from "react-navigation"
import firebase from "react-native-firebase"
import { Text } from "react-native"
import { Icon } from "react-native-elements"

import Search from "../../Screens/SearchScreen"
import AddPost from "../../Screens/AddPostScreen"
import Profile from "../../Screens/ProfileScreen"
import AddDog from "../../Screens/AddDogScreen"
import DogDetails from "../../Screens/DogDetailsScreen"

import AddEventScreen from "../../Screens/AddEventScreen"
import EventsScreen from "../../Screens/EventsScreen"
import EventDetails from "../../Screens/EventDetailsScreen"
import ChatNavigation from "../../navigations/ChatNavigation"

const ProfileStack = createStackNavigator({
  PrivateProfile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      headerLeft: (
        <Text
          style={{ marginLeft: 12 }}
          onPress={() => firebase.auth().signOut()}
        >
          Sign Out
        </Text>
      ),
      headerRight: (
        <Text
          onPress={() => navigation.navigate("ChatHome")}
          style={{ marginRight: 12 }}
        >
          Chat
        </Text>
      )
    })
  },
  AddDog: {
    screen: AddDog
  },
  ViewDog: {
    screen: DogDetails
  },
  ChatHome: {
    screen: ChatNavigation,
    navigationOptions: ({}) => ({
      header: null
    })
  }
})

const SearchStack = createStackNavigator({
  Search: {
    screen: Search
  },
  PublicProfile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      headerVisible: "false",
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
    screen: AddDog
  },
  ViewDog: {
    screen: DogDetails
  }
})

const EventStack = createStackNavigator({
  Event: {
    screen: EventsScreen
  },
  AddEvent: {
    screen: AddEventScreen
  },
  ViewEvent: {
    screen: EventDetails
  }
})

export { ProfileStack, AddPost, SearchStack, EventStack }
