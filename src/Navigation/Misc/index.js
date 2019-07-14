import React from "react"
import { createStackNavigator } from "react-navigation"
import firebase from "react-native-firebase"
import { Text, View } from "react-native"
import { Icon } from "react-native-elements"

import Search from "../../Screens/SearchScreen"
import AddPost from "../../Screens/AddPostScreen"
import Profile from "../../Screens/ProfileScreen"
import AddDogScreen from "../../Screens/AddDogScreen"
import DogDetailsScreen from "../../Screens/DogDetailsScreen"

import AddEventScreen from "../../Screens/AddEventScreen"
import EventsScreen from "../../Screens/EventsScreen"
import EventDetails from "../../Screens/EventDetailsScreen"
import ChatScreen from "../../Screens/ChatScreen"

const ProfileStack = createStackNavigator({
  PrivateProfile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      title: "YOUR PROFILE",
      headerRight: (
        <View style={{ flexDirection: "row" }}>
          <Icon
            containerStyle={{ marginRight: 12 }}
            name="chat"
            color="#000"
            onPress={() => navigation.navigate("Chat")}
          />
          <Icon
            onPress={() => firebase.auth().signOut()}
            containerStyle={{ marginRight: 12 }}
            name="input"
            color="#000"
          />
        </View>
      )
    })
  },
  Chat: {
    screen: ChatScreen,
    navigationOptions: ({ navigation }) => ({
      headerVisible: "false",
      title: "CHAT",
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
    screen: AddDogScreen
  },
  ViewDog: {
    screen: DogDetailsScreen
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
