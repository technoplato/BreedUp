import React from "react"
import { createBottomTabNavigator } from "react-navigation"
import { Image } from "react-native"

import { ProfileStack, AddPost, SearchStack, EventStack } from "../Misc"
import FeedStack from "../Feed"

import { Images } from "../../Themes"

const TabNavigation = createBottomTabNavigator(
  {
    // Event: {
    //   screen: EventStack
    // },
    Feed: FeedStack,
    Search: SearchStack,
    Post: {
      screen: AddPost,
      navigationOptions: {
        tabBarVisible: false
      }
    },
    Profile: {
      screen: ProfileStack
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarVisible: shouldShowTabBar(navigation),
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state
        let iconSource
        switch (routeName) {
          case "Feed":
            iconSource = Images.iconHome
            break
          case "Search":
            iconSource = Images.iconSearch
            break
          case "Post":
            iconSource = Images.iconAdd
            break
          case "Profile":
            iconSource = Images.iconProfile
            break
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return (
          <Image
            source={iconSource}
            style={{ marginTop: 6, height: 24, width: 24 }}
          />
        )
      }
    }),
    tabBarOptions: {
      activeTintColor: "tomato",
      inactiveTintColor: "gray"
    }
  }
)

function shouldShowTabBar(navigation) {
  const routes = navigation.state.routes
  const dest = routes && routes[1]
  const name = dest && dest.routeName

  return !(
    name === "PublicProfile" ||
    name === "ViewDog" ||
    name === "ChatHome" ||
    name === "NotificationChatHome"
  )
}

export default TabNavigation
