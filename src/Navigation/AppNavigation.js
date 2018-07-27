import { createSwitchNavigator } from 'react-navigation'

import Onboarding from './Onboarding'
import Main from './Main'

const RootNav = createSwitchNavigator(
  {
    Onboarding: Onboarding,
    Main: Main
  },
  {
    initialRouteName: 'Onboarding'
  }
)

export default RootNav
