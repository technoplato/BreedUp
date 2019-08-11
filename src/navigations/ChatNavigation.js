import { createStackNavigator } from "react-navigation"
import AppStyles from "../AppStyles"
import ChatScreen from "../screens/ChatScreen/ChatScreen"
import SearchScreen from "../screens/SearchScreen/SearchScreen"
import FriendsScreen from "../screens/FriendsScreen/FriendsScreen"
import ChatHomeScreen from "../screens/HomeScreen/HomeScreen"
import styles from "./styles"

const ChatNavigation = createStackNavigator(
  {
    Home: { screen: ChatHomeScreen },
    Chat: { screen: ChatScreen },
    Friends: { screen: FriendsScreen },
    Search: { screen: SearchScreen }
  },
  {
    initialRouteName: "Home",
    headerMode: "float",

    headerLayoutPreset: "center",
    navigationOptions: ({ navigation }) => ({
      headerTintColor: AppStyles.colorSet.mainThemeForegroundColor,
      headerTitleStyle: styles.headerTitleStyle
    }),
    cardStyle: { backgroundColor: "#FFFFFF" }
  }
)

export default ChatNavigation
