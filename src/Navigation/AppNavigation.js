import { createSwitchNavigator } from "react-navigation"

import Onboarding from "./Onboarding"
import Main from "./Main"

import Fiddling from "../Screens/Fiddling"
import React from "react"

const RootNav = createSwitchNavigator(
  {
    Onboarding: Onboarding,
    Main: Main,
    Fiddling: Fiddling
  },
  {
    initialRouteName: "Onboarding"
  }
)

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
  <RootNav
    onNavigationStateChange={currentState => {
      global.screen = getActiveRouteName(currentState)
    }}
  />
)
