import { createStackNavigator } from 'react-navigation'

import FeedScreen from '../../Containers/FeedScreen'
import CommentsScreen from '../../Containers/CommentsScreen'

export default createStackNavigator({
  Feed: FeedScreen,
  Comments: {
    screen: CommentsScreen,

    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.postAuthor}'s Post`
    })
  }
})
