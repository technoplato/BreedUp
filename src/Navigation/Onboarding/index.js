import { createSwitchNavigator } from 'react-navigation'

import Loading from 'components/LargeLoadingIndicator'
import Login from 'screens/LoginScreen'
import SignUpScreen from 'screens/SignUpScreen'

const OnboardingScreens = createSwitchNavigator(
  {
    Loading: Loading,
    Login: Login,
    SignUp: SignUpScreen
  },
  {
    initialRouteName: 'Loading'
  }
)

export default OnboardingScreens
