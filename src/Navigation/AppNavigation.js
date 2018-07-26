import { createSwitchNavigator } from 'react-navigation'

import ChooseImage from '../Containers/ChooseImage'
import Feed from './Feed'
import Loading from '../Containers/Loading'
import Login from '../Containers/Login'
import SignUp from '../Containers/SignUp'
import Fiddling from '../Containers/Fiddling'

const RootStack = createSwitchNavigator(
  {
    ChooseImage: ChooseImage,
    Main: Feed,
    Loading: Loading,
    Login: Login,
    SignUp: SignUp,
    Fiddling: Fiddling
  },
  {
    initialRouteName: 'Loading'
  }
)

export default RootStack
