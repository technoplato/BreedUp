import { createSwitchNavigator } from 'react-navigation'

import Onboarding from './Onboarding'
import Main from './Main'

import Fiddling from '../Containers/Fiddling'

const RootNav = createSwitchNavigator(
  {
    Fiddling: Fiddling,
    Onboarding: Onboarding,
    Main: Main
  },
  {
    initialRouteName: 'Fiddling'
  }
)

export default RootNav
