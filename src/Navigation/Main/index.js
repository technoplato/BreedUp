import React from 'react'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { Image } from 'react-native'

import FeedStack from '../Feed'
import SearchStack from '../Search'
import AddPost from '../Post'
import ProfileStack from '../PrivateProfile'
import MeetupStack from '../Meetup'

import { Images } from '../../Themes'

const TabNavigation = createBottomTabNavigator(
  {
    Feed: {
      screen: FeedStack,
      navigationOptions: {
        title: 'Feed'
      }
    },
    Search: SearchStack,
    Post: {
      screen: AddPost,
      navigationOptions: {
        tabBarVisible: false
      }
    },
    Profile: ProfileStack,
    Meetups: MeetupStack
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarVisible: shouldShowTabBar(navigation),
      tabBarIcon: () => {
        const { routeName } = navigation.state
        let iconSource
        switch (routeName) {
          case 'Feed':
            iconSource = Images.iconFeed
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
          case 'Meetups':
            iconSource = Images.dogs
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

const tabRoutes = ['Feed', 'Search', 'PrivateProfile', 'Meetups']

function shouldShowTabBar(navigation) {
  const name = getActiveRouteState(navigation.state).routeName
  return tabRoutes.includes(name)
}
export default TabNavigation
