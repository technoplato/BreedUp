import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { Icon } from 'react-native-elements'

import Profile from '../../Containers/Profile'
import AddPost from '../../Containers/AddPost'

const AddPostStack = createStackNavigator({
  AddPost: {
    screen: AddPost
  }
})

const ProfileStack = createStackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      headerRight: (
        <Icon
          containerStyle={{ marginRight: 12 }}
          name="search"
          color="#000"
          onPress={() =>
            alert(
              'Profile\n\nSearch Tapped\n\nSearch usernames, dog names, and provide option for nearby'
            )
          }
        />
      )
    })
  }
})

export { ProfileStack, AddPostStack }
