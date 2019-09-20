import React from 'react'
import { View, Text, FlatList } from 'react-native'
import { SearchBar, CheckBox } from 'react-native-elements'

import styles from './SearchStyle'
import {
  searchUsers,
  searchNearbyUsers,
  searchDogs,
  searchNearbyDogs
} from '../Interactors/Search'

import SearchListEmpty from 'components/SearchListEmpty'
import SearchListSeparator from 'components/SearchListSeparator'
import SearchResultUser from 'components/SearchResultUser'
import SearchResultDog from 'components/SearchResultDog'

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

        {this.state.localSearch && (
          <Text style={{ color: 'white', fontSize: 28, textAlign: 'center' }}>
            SHOWING USERS NEARBY
          </Text>
        )}

        <View style={styles.main}>
          <FlatList
            renderItem={this.renderResult}
            ItemSeparatorComponent={SearchListSeparator}
            ListEmptyComponent={<SearchListEmpty query={this.state.query} />}
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
      username: result.owner.username
    })
  }

  onDogPress = result => {
    this.props.navigation.navigate('PublicProfile', {
      userId: result.owner.uid,
      username: result.owner.username
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

    this.setState({ results: users.concat(dogs) })
  }

  onClear = () => {
    if (!this.state.localSearch) {
      this.setState({ results: [] })
    }
  }
}
