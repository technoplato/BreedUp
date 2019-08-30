import React from 'react'
import { View, Text, FlatList, TouchableHighlight } from 'react-native'
import { SearchBar, CheckBox } from 'react-native-elements'

import styles from './SearchStyle'
import {
  searchUsers,
  searchDogs,
  searchNearbyUsers,
  searchNearbyDogs
} from '../Interactors/Search'
import RoundImageView from '../Components/RoundImageView'

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
            <RoundImageView size={64} source={{ uri: item.owner.photoURL }} />
          </View>
          <View style={{ marginLeft: 12, flexDirection: 'column' }}>
            <Text>{item.owner.username}</Text>
            <Text>{item.owner.description}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
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

const SearchResultDog = ({ item, onResultPress }) => {
  const dog = item.dogs[0]
  const owner = item.owner
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
            <RoundImageView size={64} source={{ uri: dog.imageUri }} />
          </View>
          <View style={{ marginLeft: 12, flexDirection: 'column' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 22 }}>{dog.name}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <RoundImageView
            key={owner.photoURL}
            size={24}
            source={{ uri: owner.photoURL }}
          />
          <Text
            style={{ marginLeft: 8, fontWeight: '300', fontSize: 14 }}
          >{`${owner.username}'s ${dog.breed}`}</Text>
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
    if (item.type === 'dog') {
      return <SearchResultDog item={item} onResultPress={this.onDogPress} />
    } else if (item.type === 'person') {
      return <SearchResultUser item={item} onResultPress={this.onUserPress} />
    }
  }

  extractKey = item => {
    if (item.type === 'dog') {
      return item.dogs[0].id
    } else if (item.type === 'person') {
      return item.owner.uid
    }
  }

  onUserPress = result => {
    this.props.navigation.navigate('PublicProfile', {
      userId: result.owner.uid,
      username: result.owner.name
    })
  }

  onDogPress = result => {
    this.props.navigation.navigate('PublicProfile', {
      userId: result.owner.uid,
      username: result.owner.name
    })
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

    const dogs = localSearch
      ? await searchNearbyDogs(query)
      : await searchDogs(query)

    // this.setState({ results: users })
    this.setState({ results: users.concat(dogs) })
  }

  onClear = () => {
    if (!this.state.localSearch) {
      this.setState({ results: [] })
    }
  }
}
