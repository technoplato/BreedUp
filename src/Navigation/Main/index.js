import React from "react"
import { createBottomTabNavigator } from "react-navigation"
import { Image } from "react-native"

import { ProfileStack, AddPost, SearchStack, EventStack } from "../Misc"
import FeedStack from "../Feed"

import { Images } from "../../Themes"

this.previousRoute = "FeedNavigation"
this.currentRoute = "FeedNavigation"

const TabNavigation = createBottomTabNavigator(
  {
    // Event: {
    //   screen: EventStack
    // },
    FeedNavigation: FeedStack,
    Search: SearchStack,
    AddPost: {
      screen: AddPost,
      navigationOptions: {
        tabBarVisible: false
      }
    },
    ProfileScreen: {
      screen: ProfileStack
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarVisible: shouldShowTabBar(navigation),
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state
        let iconSource
        switch (routeName) {
          case "FeedNavigation":
            iconSource = Images.iconHome
            break
          case "Search":
            iconSource = Images.iconSearch
            break
          case "AddPost":
            iconSource = Images.iconAdd
            break
          case "ProfileScreen":
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
      activeTintColor: "tomato",
      inactiveTintColor: "gray"
    }
  },
  {
    initialRouteName: "FeedNavigation"
  }
)

function shouldShowTabBar(navigation) {
  const routes = navigation.state.routes
  const dest = routes && routes[1]
  const name = dest && dest.routeName

  return !(name === "PublicProfile" || name === "ViewDog")
}

// const defaultGetStateForAction = TabNavigation.router.getStateForAction
// TabNavigation.router.getStateForAction = (action, state) => {
//   return defaultGetStateForAction(action, state)
// }
//   switch (action.type) {
//     case "Navigation/INIT":
//       this.currentRoute = "FeedNavigation"
//       this.nextRoute = "FeedNavigation"
//       break
//     case "Navigation/NAVIGATE":
//       this.previousRoute = this.currentRoute
//       this.currentRoute = action.routeName
//       this.nextRoute = action.routeName
//       break
//     case this.currentRoute === "AddPost" && "Navigation/BACK":
//       console.log(state.routes)
//       // A little ugly of an approach, but AddPost is the tab where I'd like
//       // the special go back behavior. I still need to track state in
//       // other navigation. There has got to be a cleaner way of doing this
//       // but this works for now so going to stick with it. Cleanup later.
//       this.nextRoute = this.previousRoute
//       this.currentRoute = this.nextRoute
//       this.previousRoute = this.currentRoute
//       const index = state.routes.map(route => route.key).indexOf(this.nextRoute)
//       const newState = {
//         routes: state.routes,
//         index: index
//       }
//
//       console.log(newState)
//       return newState
//     case "Navigation/BACK":
//       this.nextRoute = this.previousRoute
//       this.currentRoute = this.nextRoute
//       this.previousRoute = this.currentRoute
//   }
//   console.log(this.currentRoute)
//   console.log(this.nextRoute)
//   console.log(this.previousRoute)
//   const defaultStateForAction = defaultGetStateForAction(action, state)
//   console.log(defaultStateForAction)
//   return defaultStateForAction
// }

// gets the current screen from navigation state
function getActiveRouteName(navigationState) {
  console.log("getactiveroutename")
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.AddDogScreen]
  // dive into nested navigators
  if (route.routes) {
    alert("Butthole sufrfer")
    return getActiveRouteName(route)
  }
  return route.routeName
}

export default TabNavigation
