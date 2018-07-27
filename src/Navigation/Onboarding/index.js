import { createSwitchNavigator } from 'react-navigation'

import Loading from '../../Containers/Loading'
import Login from '../../Containers/Login'
import SignUp from '../../Containers/SignUp'
import ChooseImage from '../../Containers/ChooseImage'

const OnboardingScreens = createSwitchNavigator(
  {
    Loading: Loading,
    Login: Login,
    SignUp: SignUp,
    ChooseImage
  },
  {
    initialRouteName: 'Loading'
  }
)

export default OnboardingScreens
