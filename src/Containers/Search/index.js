import React from 'react'
import { View, Text, FlatList, TouchableHighlight } from 'react-native'
import { SearchBar } from 'react-native-elements'

import styles from './SearchStyle'
import { searchUser, searchDog } from '../../Interactors/Search'

const ListEmptyComponent = ({ query }) => {
  const text =
    query === '' ? 'Search for a dog or user!' : `No results for '${query}'.`
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
    <View style={{ marginVertical: 4, height: 1, backgroundColor: 'grey' }} />
  )
}

export default class SearchScreen extends React.Component {
  static navigationOptions = {
    header: null
  }
  state = {
    query: '',
    results: []
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

  renderResult = ({ item }) => {
    if (item.dogName) {
      // render dog
      return (
        <TouchableHighlight
          onPress={() => {
            this.onResultPress(item)
          }}
          key={item.dogId}
        >
          <View>
            <Text>Dog</Text>
            <Text>{item.dogName}</Text>
          </View>
        </TouchableHighlight>
      )
    } else if (item.username) {
      // render user
      return (
        <TouchableHighlight
          style={{ backgroundColor: 'blue' }}
          onPress={() => {
            this.onResultPress(item)
          }}
          key={item.uid}
        >
          <View>
            <Text>User</Text>
            <Text>{item.username}</Text>
          </View>
        </TouchableHighlight>
      )
    }
  }

  onResultPress = result => {
    this.props.navigation.navigate('PublicProfile', {
      userId: result.owner ? result.owner.uid : result.uid,
      username: result.owner ? result.owner.name : result.username
    })
  }

  extractKey = result => {
    return result.dogId ? result.dogId : result.uid
  }

  onChangeText = async text => {
    this.setState({ query: text.toLowerCase() })
    const users = await searchUser(text)
    const dogs = await searchDog(text)
    this.setState({ results: users.concat(dogs) })
  }

  onClear = () => {
    this.setState({ results: [] })
  }
}
