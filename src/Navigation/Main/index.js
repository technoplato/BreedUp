import { createBottomTabNavigator } from 'react-navigation'

import { ProfileStack, AddPostStack } from '../Misc'

import FeedStack from '../Feed'

import MyCustomSillyDrawerComponent from '../MyCustomSillyDrawerComponent'

const RootStack = createBottomTabNavigator(
  {
    Main: FeedStack,
    AddPost: AddPostStack,
    Profile: ProfileStack
  },
  {
    initialRouteName: 'Main',
    contentComponent: MyCustomSillyDrawerComponent
  }
)

export default RootStack
