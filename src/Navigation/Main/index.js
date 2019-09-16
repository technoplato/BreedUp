import React from 'react'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { Image } from 'react-native'

import { ProfileStack, AddPost, SearchStack, EventStack } from '../Misc'
import FeedStack from '../Feed'

import { Images } from '../../Themes'

const TabNavigation = createBottomTabNavigator(
  {
    Feed: FeedStack,
    Search: SearchStack,
    Post: {
      screen: AddPost,
      navigationOptions: {
        tabBarVisible: false
      }
    },
    Profile: {
      screen: ProfileStack
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarVisible: shouldShowTabBar(navigation),
      tabBarIcon: () => {
        const { routeName } = navigation.state
        let iconSource
        switch (routeName) {
          case 'Feed':
            iconSource = Images.iconHome
            break
          case 'Search':
            iconSource = Images.iconSearch
            break
          case 'Post':
            iconSource = Images.iconAdd
            break
          case 'Profile':
            iconSource = Images.iconProfile
            break
        }

        return (
          <Image
            source={iconSource}
            style={{ marginTop: 6, height: 24, width: 24 }}
          />
        )
      },
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray'
      }
    })
  }
)

const getActiveRouteState = function(route) {
  if (
    !route.routes ||
    route.routes.length === 0 ||
    route.index >= route.routes.length
  ) {
    return route
  }

  const childActiveRoute = route.routes[route.index]
  return getActiveRouteState(childActiveRoute)
}

function shouldShowTabBar(navigation) {
  const name = getActiveRouteState(navigation.state).routeName

  const doShow = !(
    name === 'PublicProfile' ||
    name === 'ViewDog' ||
    name === 'ChatHome' ||
    name === 'NotificationChatHome' ||
    name === 'ProfileChatHome' ||
    name === 'Comments' ||
    name === 'Chat'
  )

  return doShow
}
export default TabNavigation
