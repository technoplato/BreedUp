import { createSwitchNavigator, createAppContainer } from 'react-navigation'

import Onboarding from './Onboarding'
import Main from './Main'

import React from 'react'
import { Text, View, Button } from 'react-native'
import { searchNearbyDogs } from '../Interactors/Search'

import database from '@react-native-firebase/database'

class Testing extends React.Component {
  async componentDidMount() {
    // const start = Date.now()
    // console.log('before')
    // const [a, b] = await Promise.all([
    //   new Promise(resolve => {
    //     setTimeout(() => resolve('abc'), 1000)
    //   }),
    //   new Promise(resolve => {
    //     setTimeout(() => resolve('def'), 1000)
    //   })
    // ])
    // const end = Date.now() - start
    // console.log(end, a, b)
    // console.log('after')
  }

  render() {
    return (
      <View style={{ paddingTop: 40 }}>
        <Text style={{ marginTop: 100, fontSize: 82 }}>
          {(this.state && JSON.stringify(this.state)) ||
            'Testing... look at the console'}
        </Text>
        <Button
          title="butt"
          onPress={() => {
            console.log('clicked')
          }}
        />
      </View>
    )
  }
}

const RootNav = createSwitchNavigator({
  Onboarding: Onboarding,
  Testing: Testing,
  Main: Main
})

export default createAppContainer(RootNav)
