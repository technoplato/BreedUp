import { createSwitchNavigator } from "react-navigation"

import Loading from "../../Screens/LoadingScreen"
import Login from "../../Screens/LoginScreen"
import SignUpScreen from "../../Screens/SignUpScreen"

const OnboardingScreens = createSwitchNavigator(
  {
    Loading: Loading,
    Login: Login,
    SignUp: SignUpScreen
  },
  {
    initialRouteName: "Loading"
  }
)

export default OnboardingScreens
