import { createSwitchNavigator } from 'react-navigation'

import Onboarding from './Onboarding'
import Main from './Main'

import Fiddling from '../Containers/Fiddling'

const RootNav = createSwitchNavigator(
  {
    Onboarding: Onboarding,
    Main: Main,
    Fiddling: Fiddling
  },
  {
    initialRouteName: 'Onboarding'
  }
)

export default RootNav
