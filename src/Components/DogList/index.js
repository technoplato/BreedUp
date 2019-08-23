import React from "react"
import { View, FlatList, ActivityIndicator } from "react-native"
import _ from "lodash"

import DogListItem from "../DogListItem"
import RoundPlus from "../RoundPlus"
import styles from "./DogListStyles"

import { Colors } from "../../Themes"

import { fetchDogsForUser } from "../../Interactors/Dog"
import { Text } from "react-native-elements"

export default class DogList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      dogs: []
    }

    this.loadDogs()
  }

  loadDogs = async () => {
    const { userId } = this.props
    const fetchedDogs = await fetchDogsForUser(userId)

    this.setState({ loading: false, dogs: fetchedDogs })
  }

  addDogToList = dog => {
    const dogs = this.state.dogs
    dogs.push(dog)
    this.setState({ dogs: _.uniq(dogs) })
  }

  renderItem = ({ item }) => {
    return (
      <DogListItem
        size={64}
        onDogPress={this.props.onDogPress}
        onAddDogPress={this.onAddDogPress}
        item={item}
      />
    )
  }

  /**
   * Renders the 'Add Dog' button.
   *
   * NOTE: Only renders button for current user. There is an option to
   * disable the ability for the current user to add a dog using the
   * `canAddDog` prop.
   */
  renderAddButton = () => {
    return (
      this.props.currentUser &&
      this.props.canAddDog && (
        <RoundPlus onPress={this.onAddDogPress} size={64} />
      )
    )
  }

  /**
   * Navigates to the screen where a user can add their dog.
   *
   * Only possible if viewing current user's dog list.
   */
  onAddDogPress = () => {
    this.props.navigation.navigate("AddDog", {
      userId: this.props.userId,
      onNewDogAdded: this.onNewDogAdded
    })
  }

  onNewDogAdded = dog => {
    this.addDogToList(dog)
  }

  onDogUpdated = (oldDog, updatedDog) => {
    const dogs = this.state.dogs
    const index = dogs.indexOf(oldDog)
    dogs.splice(index, 1, updatedDog)
    this.setState({ dogs: dogs })
  }

  /**
   * Renders list of user's dogs.
   *
   * NOTE: If this is the current user's profile, an 'Add Dog' button will be visible.
   */
  renderList = () => {
    return (
      <View
        style={{
          flex: 1,
          height: 44 * 1.1,
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 24,
          backgroundColor: "white"
        }}
      >
        {this.renderAddButton()}
        {this.state.dogs.length > 0 ? (
          <FlatList
            horizontal
            style={styles.container}
            data={this.state.dogs}
            extraData={this.state}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
          />
        ) : (
          <Text style={{ marginLeft: 12, fontSize: 26, fontStyle: "italic" }}>
            No dogs added yet
          </Text>
        )}
      </View>
    )
  }

  renderLoading = () => {
    return (
      <ActivityIndicator
        style={styles.loading}
        size="large"
        color={Colors.crimson}
      />
    )
  }

  render() {
    return this.state.loading ? this.renderLoading() : this.renderList()
  }

  keyExtractor = item => item.id
}
