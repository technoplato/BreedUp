import { createStackNavigator } from 'react-navigation'

import FeedScreen from '../../Containers/FeedScreen'
import CommentsScreen from '../../Containers/Comments'

export default createStackNavigator({
  Feed: FeedScreen,
  Comments: CommentsScreen
})
