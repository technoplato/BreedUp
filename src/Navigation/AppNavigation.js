import { createStackNavigator } from 'react-navigation'

import ChooseImage from '../Containers/ChooseImage'
import FeedScreen from '../Containers/FeedScreen'
import Loading from '../Containers/Loading'
import Login from '../Containers/Login'
import SignUp from '../Containers/SignUp'
import Fiddling from '../Containers/Fiddling'

const RootStack = createStackNavigator(
  {
    ChooseImage: ChooseImage,
    FeedScreen,
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
