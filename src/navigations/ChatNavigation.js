import { createStackNavigator } from 'react-navigation'
import AppStyles from '../AppStyles'
import ChatScreen from '../Screens/ChatScreen/ChatScreen'
import FriendsScreen from '../Screens/FriendsScreen/FriendsScreen'
import ChatHomeScreen from '../Screens/ChatHomeScreen/ChatHomeScreen'
import styles from './styles'

const ChatNavigation = createStackNavigator(
  {
    ChatHome: { screen: ChatHomeScreen },
    Chat: { screen: ChatScreen }
  },
  {
    initialRouteName: 'ChatHome'
    // navigationOptions: ({}) => ({
    //   headerVisible: false
    // })
    // headerMode: "float",

    // headerLayoutPreset: "center",
    // navigationOptions: ({}) => ({
    //   header: null
    // headerTintColor: AppStyles.colorSet.mainThemeForegroundColor,
    //  headerTitleStyle: styles.headerTitleStyle
    // })
    // cardStyle: { backgroundColor: "#FFFFFF" }
  }
)

export default ChatNavigation
