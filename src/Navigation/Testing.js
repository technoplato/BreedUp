import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Dimensions
} from 'react-native'
import moment from 'moment'

import firestore from '@react-native-firebase/firestore'
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'
import generatePosts from 'utilities/generate-posts'

const INITIAL_LOAD = 20
const PAGE_SIZE = 15

const useInfiniteScroll = uid => {
  const [isFetching, setIsFetching] = useState(true)
  const [posts, setPosts] = useState([])
  const [allOlderPostsFetched, setAllOlderPostsFetched] = useState(false)

  const lastIndex = posts.length - 1
  const lastItem = posts.length ? posts[lastIndex] : null
  const oldestPostTime = lastItem ? lastItem.created : new Date().getTime()
  const pageSize = lastIndex === -1 ? INITIAL_LOAD : PAGE_SIZE

  useEffect(() => {
    const handleChanges = snapshot => {}

    const query = firestore()
      .collection('posts')
      .orderBy('created', 'desc')
      .startAt(oldestPostTime)
      .limit(pageSize)
    uid && query.where('author.uid', '==', uid)

    const unsubscribe = query.onSnapshot(handleChanges)
  }, [oldestPostTime])

  useEffect(() => {
    if (!isFetching || allOlderPostsFetched) return
    const loadAsync = async () => {
      setIsFetching(true)

      let query = firestore()
        .collection('test-posts')
        .orderBy('created', 'desc')
        .startAfter(oldestPostTime)
        .limit(pageSize)
      uid && query.where('author.uid', '==', uid)

      const olderPosts = await query
        .get()
        .then(snap => snap.docs.map(doc => doc.data()))

      if (olderPosts.length < pageSize) {
        setAllOlderPostsFetched(true)
      }

      setPosts(recentPosts => [...recentPosts, ...olderPosts])

      setIsFetching(false)
    }
    loadAsync()
  }, [isFetching])

  return [posts, isFetching, setIsFetching, allOlderPostsFetched]
}
export default () => {
  const [
    posts,
    isFetching,
    setIsFetching,
    allOlderPostsFetched
  ] = useInfiniteScroll()

  // generatePosts(3)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.blueBox}>
        <Text style={styles.bigWhiteBoldText}>
          {`${posts.length} Items Loaded`}
        </Text>
      </View>
      <FlatList
        onEndReachedThreshold={4}
        onEndReached={() => {
          if (!isFetching && !allOlderPostsFetched) {
            setIsFetching(true)
          }
        }}
        data={posts}
        keyExtractor={item => {
          return item.id
        }}
        renderItem={({ item }) => {
          return <Item item={item} />
        }}
      />

      {allOlderPostsFetched && (
        <View style={styles.blueBox}>
          <Text style={styles.bigWhiteBoldText}>
            (No Older Posts Available)
          </Text>
        </View>
      )}
      {isFetching && (
        <View style={styles.blueBox}>
          <Text style={styles.bigWhiteBoldText}>(Fetching More)</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

class Item extends React.PureComponent {
  render() {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{this.props.item.text}</Text>
        <Text style={styles.title}>
          {moment(this.props.item.created).fromNow()}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    backgroundColor: 'yellow'
  },
  item: {
    backgroundColor: '#f9c2ff',
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height * 0.45,
    marginVertical: 8,
    marginHorizontal: 16
  },
  title: {
    fontSize: 24
  },
  blueBox: {
    height: 50,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bigWhiteBoldText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold'
  }
})
