import React from 'react'
import { Icon } from 'react-native-elements'
import { createStackNavigator } from 'react-navigation'

import FeedScreen from '../../Containers/FeedScreen'
import CommentsScreen from '../../Containers/CommentsScreen'

export default createStackNavigator({
  Feed: {
    screen: FeedScreen,
    navigationOptions: ({ navigation }) => ({
      headerRight: (
        <Icon
          containerStyle={{ marginRight: 12 }}
          name="search"
          color="#000"
          onPress={() =>
            alert('Feed\n\nSearch Tapped\n\nsearch usernames only')
          }
        />
      )
    })
  },
  Comments: {
    screen: CommentsScreen,
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.postAuthor}'s Post`,
      headerLeft: (
        <Icon
          containerStyle={{ marginLeft: 12 }}
          name="arrow-back"
          color="#000"
          onPress={() => navigation.goBack()}
        />
      )
    })
  }
})
