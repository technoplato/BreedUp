import { createSwitchNavigator } from "react-navigation"

import Onboarding from "./Onboarding"
import Main from "./Main"

import Fiddling from "../Screens/Fiddling"
import React from "react"
import { Text } from "react-native-elements"
import * as firebase from "firebase-admin"

class Testing extends React.Component {
  async componentDidMount() {
    const fs = firebase.firestore()
    const c1 = fs.collection("testing1")
    const c2 = fs.collection("testing2")

    await c1
      .doc("test1")
      .collection("sub")
      .add({ name: "foo", type: "bar" })
    await c2
      .doc("test2")
      .collection("sub")
      .add({ name: "foo", type: "bar" })

    fs.collectionGroup("sub")
  }

  render() {
    return <Text>Testing... look at the console</Text>
  }
}

const RootNav = createSwitchNavigator({
  Testing: Testing,
  Onboarding: Onboarding,
  Main: Main,
  Fiddling: Fiddling
})

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
