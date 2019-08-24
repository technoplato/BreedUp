import React from "react"
import { View, Text, FlatList, TouchableHighlight } from "react-native"
import { SearchBar } from "react-native-elements"

import styles from "./SearchStyle"
import { searchUsers, searchDogs } from "../Interactors/Search"
import RoundImageView from "../Components/RoundImageView"

const ListEmptyComponent = ({ query }) => {
  const text =
    query === "" ? "Search for a user!" : `No results for '${query}'.`
  return (
    <View>
      <Text
        style={{
          fontSize: 28
        }}
      >
        {text}
      </Text>
    </View>
  )
}

const ItemSeparatorComponent = () => {
  return (
    <View style={{ marginVertical: 4, height: 1, backgroundColor: "grey" }} />
  )
}

const SearchResultUser = ({ item, onResultPress }) => {
  console.log(item)
  return (
    <TouchableHighlight
      onPress={() => onResultPress(item)}
      key={item.owner.uid}
    >
      <View
        style={{
          flex: 1,
          padding: 12,
          flexDirection: "column",
          backgroundColor: "white"
        }}
      >
        <View style={{ flexDirection: "row", marginBottom: 12 }}>
          <View style={{}}>
            <RoundImageView size={64} source={{ uri: item.owner.photoURL }} />
          </View>
          <View style={{ marginLeft: 12, flexDirection: "column" }}>
            <Text>{item.owner.name}</Text>
            <Text>{item.owner.description}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          {item.dogs &&
            item.dogs.map(dogImageUri => (
              <RoundImageView
                key={dogImageUri}
                size={24}
                source={{ uri: dogImageUri }}
              />
            ))}
        </View>
      </View>
    </TouchableHighlight>
  )
}

export default class SearchScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    query: "",
    results: []
  }
  render() {
    return (
      <View style={styles.screen}>
        <SearchBar
          autoCorrect={false}
          autoCapitalize={"none"}
          containerStyle={{ width: "100%" }}
          value={this.state.query}
          lightTheme
          onChangeText={this.onChangeText}
          onClear={this.onClear}
          placeholder="Search for dog or user"
        />
        <View style={styles.main}>
          <FlatList
            renderItem={this.renderResult}
            ItemSeparatorComponent={ItemSeparatorComponent}
            ListEmptyComponent={<ListEmptyComponent query={this.state.query} />}
            data={this.state.results}
            keyExtractor={this.extractKey}
          />
        </View>
      </View>
    )
  }

  renderResult = ({ item }) => (
    <SearchResultUser item={item} onResultPress={this.onResultPress} />
  )

  onResultPress = result => {
    this.props.navigation.navigate("PublicProfile", {
      userId: result.owner.uid,
      username: result.owner.name
    })
  }

  extractKey = result => result.owner.uid

  onChangeText = async text => {
    this.setState({ query: text.toLowerCase() })
    const users = await searchUsers(text)
    // If Kent wants to search for dogs
    // const dogs = await searchDogs(text)
    // console.log(dogs)
    this.setState({ results: users })
  }

  onClear = () => {
    this.setState({ results: [] })
  }
}
