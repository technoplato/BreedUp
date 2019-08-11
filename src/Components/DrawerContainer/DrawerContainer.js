import React from "react"
import { View } from "react-native"
import MenuButton from "../MenuButton/MenuButton"
import AppStyles from "../../AppStyles"
import styles from "./styles"

export default class DrawerContainer extends React.Component {
  render() {
    const { navigation } = this.props
    return (
      <View style={styles.content}>
        <View style={styles.container}>
          <MenuButton
            title="Home"
            source={AppStyles.iconSet.home}
            onPress={() => {
              navigation.navigate("HomeStack")
            }}
          />
          <MenuButton
            title="Friends"
            source={AppStyles.iconSet.users}
            onPress={() => {
              navigation.navigate("FriendsStack")
            }}
          />
          <MenuButton
            title="Search"
            source={AppStyles.iconSet.search}
            onPress={() => {
              navigation.navigate("SearchStack")
            }}
          />
          <MenuButton
            title="My Profile"
            source={AppStyles.iconSet.user}
            onPress={() => {
              navigation.navigate("MyProfile")
            }}
          />
          <MenuButton
            title="Logout"
            source={AppStyles.iconSet.logout}
            onPress={() => {
              navigation.dispatch({ type: "Logout" })
            }}
          />
        </View>
      </View>
    )
  }
}
