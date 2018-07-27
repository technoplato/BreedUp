import { createDrawerNavigator } from 'react-navigation'

import { ProfileStack, MeetupStack, AddPostStack } from '../Misc'

import FeedStack from '../Feed'

import MyCustomSillyDrawerComponent from '../MyCustomSillyDrawerComponent'

const RootStack = createDrawerNavigator(
  {
    Main: FeedStack,
    Profile: ProfileStack,
    Meetup: MeetupStack,
    AddPost: AddPostStack
  },
  {
    initialRouteName: 'Main',
    contentComponent: MyCustomSillyDrawerComponent
  }
)

export default RootStack
