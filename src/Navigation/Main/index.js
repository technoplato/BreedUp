import React from 'react'
import { createBottomTabNavigator, NavigationActions } from 'react-navigation'

import { ProfileStack, AddPost } from '../Misc'

import FeedStack from '../Feed'

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
    case 'Navigation/BACK':
      this.nextRoute = this.previousRoute
      this.currentRoute = this.nextRoute
      this.previousRoute = this.currentRoute
      const index = state.routes.map(route => route.key).indexOf(this.nextRoute)
      const newState = {
        routes: state.routes,
        index: index
      }
      return newState
  }

  return defaultGetStateForAction(action, state)
}

export default () => <TabNavigation />
