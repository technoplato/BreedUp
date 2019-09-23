import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Dimensions
} from 'react-native'

import firestore from '@react-native-firebase/firestore'
import moment from 'moment'
import _ from 'lodash'

import ShowNewPostsButton from 'components/ShowNewPostsButton'
import generatePosts from 'utilities/generate-posts'
import useScrollToTop from 'hooks/use-scroll-to-top'
import prunePost from 'utilities/prune-post'

const INITIAL_LOAD = 20
const PAGE_SIZE = 15

const testListRef = listRef => {
  const props = _.get(listRef.current, 'props', {})
  console.log('L25 listRef.props ===', props)

  if (listRef.current) {
    listRef.current.props.data = props.data.slice(0, 2)
  }
  console.log('L28 props ===', props)
}

const useInfiniteScroll = uid => {
  const [listRef, setDoScroll] = useScrollToTop()
  const [isFetching, setIsFetching] = useState(true)
  const [posts, setPosts] = useState({})
  const [staged, setStagedPosts] = useState({})
  const [showStaged, doShowStaged] = useState(false)
  const [oldest, setOldest] = useState(new Date().getTime())
  const [allOlderPostsFetched, setAllOlderPostsFetched] = useState(false)

  const pageSize = Object.keys(posts).length === 0 ? INITIAL_LOAD : PAGE_SIZE

  // This effect is triggered when the oldest post in the list changes
  // It is responsible for staging new posts, modifying existing posts,
  // and deleting posts that are deleted.
  useEffect(() => {
    if (Object.keys(posts).length === 0) return

    const handleChanges = snapshot => {
      const changes = {}

      let doScroll = false
      snapshot.docChanges().forEach(({ type, doc }) => {
        const post = doc.data()
        _.setWith(changes, `[${type}][${post.id}]`, post, Object)
      })

      setPosts(previousPosts => {
        const copy = { ...previousPosts }

        Object.entries(changes)
          .map(([type, list]) => {
            return { type, list: Object.values(list) }
          })
          .filter(({ list }) => {
            return !_.isEmpty(list)
          })
          .forEach(({ type, list }) => {
            switch (type) {
              case 'added':
                list.forEach(post => {
                  if (!copy[post.id]) {
                    if (post.author.uid === global.user.uid) {
                      doScroll = true
                      copy[post.id] = prunePost(post)
                    } else {
                      stagePost(post)
                    }
                  }
                })
                break

              case 'modified':
                list.forEach(post => {
                  copy[post.id] = prunePost(post)
                })
                break

              case 'removed':
                list.forEach(post => {
                  delete copy[post.id]
                })
                break

              default:
                throw `Unexpected type ${type}`
            }
          })

        return copy
      })

      setDoScroll(doScroll)
    }

    const stagePost = post => {
      const stagedCopy = { ...staged }
      stagedCopy[post.id] = post
      setStagedPosts(oldStaged => {
        const copy = { ...oldStaged }
        copy[post.id] = post
        return copy
      })
    }

    const query = firestore()
      .collection('test-posts')
      .orderBy('created', 'desc')
      .endAt(oldest)
    uid && query.where('author.uid', '==', uid)

    const unsubscribe = query.onSnapshot(handleChanges)

    return () => {
      console.log('Unsubscribing')
      unsubscribe()
    }
  }, [oldest])

  // Fetch new posts (created more distantly in the past)
  // Triggers when the end of the list is reached
  useEffect(() => {
    if (!isFetching || allOlderPostsFetched) return
    const loadAsync = async () => {
      setIsFetching(true)

      let query = firestore()
        .collection('test-posts')
        .orderBy('created', 'desc')
        .startAfter(oldest)
        .limit(pageSize)
      uid && query.where('author.uid', '==', uid)

      const olderPosts = await query
        .get()
        .then(snap => snap.docs.map(doc => doc.data()))

      const length = olderPosts.length

      if (length < pageSize) {
        setAllOlderPostsFetched(true)
      }

      const updatedPosts = { ...posts }
      olderPosts.forEach(post => (updatedPosts[post.id] = post))
      setPosts(updatedPosts)

      const oldestCreated = length ? olderPosts[length - 1].created : 0
      setOldest(oldestCreated)

      setIsFetching(false)
    }
    loadAsync()
  }, [isFetching])

  // Show staged posts
  useEffect(() => {
    if (!showStaged) return

    setPosts(oldPosts => {
      const copy = { ...oldPosts }
      Object.values(staged).forEach(post => (copy[post.id] = post))
      return copy
    })

    setStagedPosts({})
    doShowStaged(false)
  }, [showStaged])

  return [
    Object.values(posts).sort((p1, p2) => (p1.created <= p2.created ? 1 : -1)),
    isFetching,
    setIsFetching,
    allOlderPostsFetched,
    listRef,
    staged,
    doShowStaged
  ]
}

export default () => {
  const [
    posts,
    isFetching,
    setIsFetching,
    allOlderPostsFetched,
    listRef,
    staged,
    doShowStaged
  ] = useInfiniteScroll()

  // generatePosts(3)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.blueBox}>
        <Text
          onLongPress={() => {
            // fake add one of their posts
            generatePosts(1, 'Boppb')
          }}
          onPress={() => {
            // fake add one of my posts
            generatePosts(1, global.user.uid)
          }}
          style={styles.bigWhiteBoldText}
        >
          {`${posts.length} Items Loaded`}
        </Text>
      </View>
      <ShowNewPostsButton staged={staged} onPress={() => doShowStaged(true)} />

      <FlatList
        onEndReachedThreshold={4}
        onEndReached={() => {
          if (!isFetching && !allOlderPostsFetched) {
            setIsFetching(true)
          }
        }}
        ref={listRef}
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
          <Text style={styles.bigWhiteBoldText}>(No Older Posts)</Text>
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

import useUpdatingTimestamp from 'hooks/use-updating-timestamp'

const Item = ({ item }) => {
  const { text, created } = item

  const formattedTime = useUpdatingTimestamp(created)

  // You can use any of the following here, it's completely a preference
  //     1) "useMemo" with implicit view return
  //     useMemo (() => (        <view stuff>), [dependencies])
  //
  //     2) "useMemo" with explicit view return <~~ I happen to prefer this one
  //        I like it because, as you see below, you can log stuff!
  //     useMemo (() => { return (view stuff)}, [dependencies])
  //
  //     2) "useCallback" with implicit view return
  //     useCallback(            <view stuff>,  [dependencies])

  // return useMemo(
  //   () => (
  //     <View style={styles.item}>
  //       <Text style={styles.title}>{item.text}</Text>
  //       <Text style={styles.subtitle}>{'By: ' + item.author.username}</Text>
  //       <Text style={styles.title}>{'ID: ' + item.id}</Text>
  //       <Text style={styles.title}>{formattedTime}</Text>
  //     </View>
  //   ),
  //   [text, formattedTime]
  // )

  // return useCallback(
  //   <View style={styles.item}>
  //     <Text style={styles.title}>{item.text}</Text>
  //     <Text style={styles.subtitle}>{'By: ' + item.author.username}</Text>
  //     <Text style={styles.title}>{'ID: ' + item.id}</Text>
  //     <Text style={styles.title}>{formattedTime}</Text>
  //   </View>,
  //   [text, formattedTime]
  // )

  return useMemo(() => {
    console.log('L295 "Rendering item: " + text ===', 'Rendering item: ' + text)
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.text}</Text>
        <Text style={styles.subtitle}>{'By: ' + item.author.username}</Text>
        <Text style={styles.subtitle}>{'ID: ' + item.id}</Text>
        <Text style={styles.subtitle}>{formattedTime}</Text>
      </View>
    )
  }, [text, formattedTime])
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
  subtitle: { fontSize: 14 },
  blueBox: {
    paddingVertical: 24,
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
