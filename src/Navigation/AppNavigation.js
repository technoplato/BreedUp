import { createSwitchNavigator, createAppContainer } from "react-navigation"

import Onboarding from "./Onboarding"
import Main from "./Main"

import Fiddling from "../Screens/Fiddling"
import React from "react"
import { Text, View, Button } from "react-native"
import { searchNearbyDogs } from "../Interactors/Search"

// import * as  firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database';

class Testing extends React.Component {
  async componentDidMount() {
    // updateUserLocation(kentId)
    console.log(await database().ref("users").once("value").then(snap => JSON.stringify(snap.val())));
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
  Testing: Testing,
  // Onboarding: Onboarding,
  // Main: Main,
  // Fiddling: Fiddling
})

export default createAppContainer(RootNav)
