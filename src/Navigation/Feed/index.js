import React from "react"
import { Icon } from "react-native-elements"
import { createStackNavigator } from "react-navigation"

import FeedScreen from "../../Containers/FeedScreen"
import CommentsScreen from "../../Containers/CommentsScreen"

import Profile from "../../Containers/Profile"

export default createStackNavigator({
  Feed: {
    screen: FeedScreen
  },
  Comments: {
    screen: CommentsScreen,
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.post.author_username}'s Post`,
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
  }
})
