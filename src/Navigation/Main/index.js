import React from "react"
import { createBottomTabNavigator } from "react-navigation"
import { Image } from "react-native"

import { ProfileStack, AddPost, SearchStack, EventStack } from "../Misc"
import FeedStack from "../Feed"

import { Images } from "../../Themes"

import MyCustomSillyDrawerComponent from "../MyCustomSillyDrawerComponent"

this.previousRoute = "Main"
this.currentRoute = "Main"

const TabNavigation = createBottomTabNavigator(
  {
    Event: {
      screen: EventStack
    },
    Main: FeedStack,
    Search: SearchStack,
    AddPost: {
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
          case "Main":
            iconSource = Images.iconHome
            break
          case "Search":
            iconSource = Images.iconSearch
            break
          case "AddPost":
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
  },
  {
    initialRouteName: "Main",
    contentComponent: MyCustomSillyDrawerComponent
  }
)

function shouldShowTabBar(navigation) {
  const routes = navigation.state.routes
  const dest = routes && routes[1]
  const name = dest && dest.routeName

  return !(name === "PublicProfile" || name === "ViewDog")
}

const defaultGetStateForAction = TabNavigation.router.getStateForAction
TabNavigation.router.getStateForAction = (action, state) => {
  switch (action.type) {
    case "Navigation/INIT":
      this.currentRoute = "Main"
      this.nextRoute = "Main"
      break
    case "Navigation/NAVIGATE":
      this.previousRoute = this.currentRoute
      this.currentRoute = action.routeName
      this.nextRoute = action.routeName
      break
    case this.currentRoute === "AddPost" && "Navigation/BACK":
      // A little ugly of an approach, but AddPost is the tab where I'd like
      // the special go back behavior. I still need to track state in
      // other navigation. There has got to be a cleaner way of doing this
      // but this works for now so going to stick with it. Cleanup later.
      this.nextRoute = this.previousRoute
      this.currentRoute = this.nextRoute
      this.previousRoute = this.currentRoute
      const index = state.routes.map(route => route.key).indexOf(this.nextRoute)
      const newState = {
        routes: state.routes,
        index: index
      }
      return newState
    case "Navigation/BACK":
      this.nextRoute = this.previousRoute
      this.currentRoute = this.nextRoute
      this.previousRoute = this.currentRoute
  }

  const defaultStateForAction = defaultGetStateForAction(action, state)
  return defaultStateForAction
}

// gets the current screen from navigation state
function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route)
  }
  return route.routeName
}

export default () => (
  <TabNavigation
    onNavigationStateChange={(prevState, currentState) => {
      const currentScreen = getActiveRouteName(currentState)
      const prevScreen = getActiveRouteName(prevState)

      if (prevScreen !== currentScreen) {
        // the line below uses the Google Analytics tracker
        // change the tracker here to use other Mobile analytics SDK.
        // console.log('Current Screen:\t', currentScreen)
        // console.log('PREVIOUS Screen:\t', prevScreen)
      }
    }}
  />
)
