import { createSwitchNavigator } from "react-navigation"

import Onboarding from "./Onboarding"
import Main from "./Main"

import Fiddling from "../Screens/Fiddling"
import React from "react"
import { Text, View, Button } from "react-native"
import { searchNearbyDogs } from "../Interactors/Search"

class Testing extends React.Component {
  async componentDidMount() {
    // updateUserLocation(kentId)
  }

  render() {
    return (
      <View style={{ paddingTop: 40 }}>
        <Text style={{ marginTop: 100, fontSize: 82 }}>
          {(this.state && JSON.stringify(this.state)) ||
            "Testing... look at the console"}
        </Text>
        <Button
          title="butt"
          onPress={() => {
            console.log("clicked")
          }}
        />
      </View>
    )
  }
}

const RootNav = createSwitchNavigator({
  Onboarding: Onboarding,
  Testing: Testing,
  Main: Main,
  Fiddling: Fiddling
})

export default RootNav
