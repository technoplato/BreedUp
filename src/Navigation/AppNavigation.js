import React from 'react'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'

import Onboarding from './Onboarding'
import Main from './Main'

const RootNav = createSwitchNavigator({
  Onboarding: Onboarding,
  Main: Main
})

export default createAppContainer(RootNav)
