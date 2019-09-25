import React from 'react'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'

import Onboarding from './Onboarding'
import Main from './Main'
import { View, Image } from 'react-native'

const Foo = () => {
  return (
    <View>
      <Image source={{ uri: '' }} />
    </View>
  )
}

const RootNav = createSwitchNavigator({
  Onboarding: Onboarding,
  Main: Main
})

export default createAppContainer(RootNav)
