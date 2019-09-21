import React from 'react'
import { SafeAreaView, View, FlatList, StyleSheet, Text } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import firebase from '@react-native-firebase/app'

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item'
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item'
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item'
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28baa',
    title: 'Fourth Item'
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63b',
    title: 'Fifth Item'
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72c',
    title: '6 Item'
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bad',
    title: '7 Item'
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63e',
    title: '8 Item'
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72f',
    title: '9 Item'
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bag',
    title: '10 Item'
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63h',
    title: '11 Item'
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72i',
    title: '12 Item'
  }
]

export default class Testing extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          onEndReached={this.onEndReached}
          data={DATA}
          renderItem={({ item }) => <Item title={item.title} />}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    )
  }

  onEndReached = info
}

function Item({ title }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24
  },
  item: {
    backgroundColor: '#f9c2ff',
    height: 200,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16
  },
  title: {
    fontSize: 32
  }
})
