import { createSwitchNavigator } from "react-navigation"

import Loading from "../../Containers/Loading"
import Login from "../../Containers/Login"
import SignUp from "../../Containers/SignUp"

const OnboardingScreens = createSwitchNavigator(
  {
    Loading: Loading,
    Login: Login,
    SignUp: SignUp
  },
  {
    initialRouteName: "Loading"
  }
)

export default OnboardingScreens
