import React from 'react'
import { createBottomTabNavigator, NavigationActions } from 'react-navigation'
import { Image } from 'react-native'

import { ProfileStack, AddPost } from '../Misc'

import FeedStack from '../Feed'
import { Images } from '../../Themes'

import MyCustomSillyDrawerComponent from '../MyCustomSillyDrawerComponent'

this.previousRoute = 'Main'
this.currentRoute = 'Main'

const TabNavigation = createBottomTabNavigator(
  {
    Main: FeedStack,
    AddPost: {
      screen: AddPost,
      navigationOptions: {
        tabBarVisible: false
      }
    },
    Profile: ProfileStack
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state
        let iconSource
        switch (routeName) {
          case 'Main':
            iconSource = Images.iconHome
            break
          case 'AddPost':
            iconSource = Images.iconAdd
            break
          case 'Profile':
            iconSource = Images.iconProfile
            break
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return (
          <Image
            source={iconSource}
            style={{ marginTop: 6, height: 24, width: 24 }}
          />
        )
      }
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray'
    }
  },
  {
    initialRouteName: 'Main',
    contentComponent: MyCustomSillyDrawerComponent
  }
)

const defaultGetStateForAction = TabNavigation.router.getStateForAction
TabNavigation.router.getStateForAction = (action, state) => {
  switch (action.type) {
    case 'Navigation/INIT':
      this.currentRoute = 'Main'
      this.nextRoute = 'Main'
      break
    case 'Navigation/NAVIGATE':
      this.previousRoute = this.currentRoute
      this.currentRoute = action.routeName
      this.nextRoute = action.routeName
      break
    case this.currentRoute === 'AddPost' && 'Navigation/BACK':
      // A little ugly of an approach, but AddPost is the tab where I'd like
      // the special go back behavior. I still need to track state in
      // other navigation. There has got to be a cleaner way of doing this
      // but this works for now so going to stick with it. Cleanup later.
      this.nextRoute = this.previousRoute
      this.currentRoute = this.nextRoute
      this.previousRoute = this.currentRoute
      const index = state.routes.map(route => route.key).indexOf(this.nextRoute)
      const newState = {
        routes: state.routes,
        index: index
      }
      return newState
    case 'Navigation/BACK':
      this.nextRoute = this.previousRoute
      this.currentRoute = this.nextRoute
      this.previousRoute = this.currentRoute
  }

  return defaultGetStateForAction(action, state)
}

export default () => <TabNavigation />
