import { createStackNavigator } from "react-navigation"
import AppStyles from "../AppStyles"
import ChatScreen from "../Screens/ChatScreen/ChatScreen"
import FriendsScreen from "../Screens/FriendsScreen/FriendsScreen"
import ChatHomeScreen from "../Screens/HomeScreen/HomeScreen"
import styles from "./styles"

const ChatNavigation = createStackNavigator(
  {
    Home: { screen: ChatHomeScreen },
    Chat: { screen: ChatScreen },
    Friends: { screen: FriendsScreen }
  },
  {
    initialRouteName: "Home",
    headerMode: "float",

    headerLayoutPreset: "center",
    navigationOptions: ({}) => ({
      headerTintColor: AppStyles.colorSet.mainThemeForegroundColor,
      headerTitleStyle: styles.headerTitleStyle
    }),
    cardStyle: { backgroundColor: "#FFFFFF" }
  }
)

export default ChatNavigation
