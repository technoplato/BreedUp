import React from 'react'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'

import Onboarding from './Onboarding'
import Main from './Main'
import Testing from './Testing'

const RootNav = createSwitchNavigator({
  Onboarding: Onboarding,
  Main: Main,
  Testing: Testing
})

export default createAppContainer(RootNav)
