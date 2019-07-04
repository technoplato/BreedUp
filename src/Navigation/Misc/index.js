import React from "react"
import { createStackNavigator } from "react-navigation"
import firebase from "react-native-firebase"
import { Text } from "react-native"
import { Icon } from "react-native-elements"

import Search from "../../Containers/Search"
import AddPost from "../../Containers/AddPost"
import Profile from "../../Containers/Profile"
import AddDog from "../../Containers/AddDog"
import ViewDog from "../../Containers/ViewDog"

import AddEventScreen from "../../Containers/AddEventScreen"
import EventsScreen from "../../Containers/Event"
import ViewEventScreen from "../../Containers/ViewEventScreen"

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
      )
    })
  },
  AddDog: {
    screen: AddDog
  },
  ViewDog: {
    screen: ViewDog
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
    screen: ViewDog
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
    screen: ViewEventScreen
  }
})

export { ProfileStack, AddPost, SearchStack, EventStack }
