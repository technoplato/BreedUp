import { createSwitchNavigator, createAppContainer } from 'react-navigation'

import Onboarding from './Onboarding'
import Main from './Main'

import React from 'react'
import Testing from './Testing'

const RootNav = createSwitchNavigator({
  Onboarding: Onboarding,
  Testing: Testing,
  Main: Main
})

export default createAppContainer(RootNav)
