import React from 'react'
import { Button } from 'react-native'
import { Icon } from 'react-native-elements'
import { createStackNavigator } from 'react-navigation'

import FeedScreen from '../../Containers/FeedScreen'
import CommentsScreen from '../../Containers/CommentsScreen'

export default createStackNavigator(
  {
    Feed: FeedScreen,
    Comments: {
      screen: CommentsScreen,

      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.postAuthor}'s Post`
      })
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      headerLeft: (
        <Icon
          containerStyle={{ marginLeft: 12 }}
          name="menu"
          color="#000"
          onPress={() => navigation.toggleDrawer()}
        />
      )
    })
  }
)
