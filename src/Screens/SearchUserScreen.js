import React from 'react'
import { View, Text, FlatList, TouchableHighlight } from 'react-native'
import { SearchBar, CheckBox } from 'react-native-elements'

import styles from './SearchStyle'
import {
  searchUsers,
  searchDogs,
  searchNearbyUsers,
  searchNearbyDogs
} from 'interactors/Search'

import RoundImageView from 'components/RoundImageView'
import DogListItem from 'components/DogListItem'

const ListEmptyComponent = ({ query }) => {
  const text =
    query === '' ? 'Search for a user!' : `No results for '${query}'.`
  return (
    <View>
      <Text
        style={{
          color: 'white',
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
    <View style={{ marginVertical: 4, height: 1, backgroundColor: 'grey' }} />
  )
}

const SearchResultUser = ({ item, onResultPress }) => {
  return (
    <TouchableHighlight onPress={() => onResultPress(item)}>
      <View
        style={{
          flex: 1,
          padding: 12,
          flexDirection: 'column',
          backgroundColor: 'white'
        }}
      >
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          <View style={{}}>
            <RoundImageView size={64} source={{ uri: item.owner.photo }} />
          </View>
          <View style={{ marginLeft: 12, flexDirection: 'column' }}>
            <Text>{item.owner.username}</Text>
            <Text>{item.owner.description}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {item.dogs &&
            item.dogs.map(dog => (
              <DogListItem
                onDogPress={() => {
                  onResultPress(item)
                }}
                item={dog}
                key={dog.id}
                size={24}
                imageUri={{ uri: dog.imageUri }}
              />
            ))}
        </View>
      </View>
    </TouchableHighlight>
  )
}

export default class SearchUserScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    query: '',
    results: [],
    localSearch: false
  }

  render() {
    return (
      <View style={styles.screen}>
        <SearchBar
          autoCorrect={false}
          autoCapitalize={'none'}
          containerStyle={{ width: '100%' }}
          value={this.state.query}
          lightTheme
          onChangeText={this.onChangeText}
          onClear={this.onClear}
          placeholder="Search for dog or user"
        />
        <View>
          <CheckBox
            onPress={this.onLocalSearchToggle}
            containerStyle={{
              backgroundColor: 'white',
              width: '95%',
              flexDirection: 'row'
            }}
            title={
              this.state.localSearch
                ? 'Uncheck to search everywhere!'
                : 'Check to search locally!'
            }
            checked={this.state.localSearch}
          />
        </View>

        {this.state.localSearch && (
          <Text style={{ color: 'white', fontSize: 28, textAlign: 'center' }}>
            SHOWING USERS NEARBY
          </Text>
        )}

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

  onLocalSearchToggle = () => {
    this.setState({ localSearch: !this.state.localSearch }, () => {
      this.performSearch(this.state.query)
    })
  }

  renderResult = ({ item }) => {
    return <SearchResultUser item={item} onResultPress={this.onUserPress} />
  }

  extractKey = item => {
    return item.owner.uid
  }

  onUserPress = ({ owner }) => {
    this.props.navigation.state.params.onUserChosen({
      name: owner.username,
      photo: owner.photo,
      description: owner.description || '',
      uid: owner.uid
    })
    this.props.navigation.goBack()
  }

  onChangeText = async text => {
    this.setState({ query: text.toLowerCase() })
    this.performSearch(text)
  }

  performSearch = async query => {
    const { localSearch } = this.state

    const users = localSearch
      ? await searchNearbyUsers(query)
      : await searchUsers(query)

    this.setState({ results: users })
  }

  onClear = () => {
    if (!this.state.localSearch) {
      this.setState({ results: [] })
    }
  }
}
