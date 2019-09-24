import React, { useState, useCallback, useMemo } from 'react'
import { View, Text, FlatList } from 'react-native'

import DogListItem from '../DogListItem'
import RoundPlus from '../RoundPlus'
import styles from './DogListStyles'

import Loading from '../LargeLoadingIndicator'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import firestore from '@react-native-firebase/firestore'

export default ({ userId: ownerId, canAddDog, navigation, onDogPress }) => {
  const [isMe] = useState(ownerId === global.user.uid)
  const [dogs, loading] = useCollectionData(
    firestore()
      .collection('dogs')
      .where('owner.uid', '==', ownerId)
  )

  const onAddDogPress = useCallback(() => {
    navigation.navigate('AddDog', {
      userId: ownerId
    })
  }, [ownerId])

  const addButton = useMemo(() => {
    if (!isMe || !canAddDog) return null
    return <RoundPlus onPress={onAddDogPress} size={64} />
  }, [ownerId])

  if (loading) {
    return <Loading />
  }

  return (
    <View
      style={{
        flex: 1,
        height: 44 * 1.1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 24,
        backgroundColor: 'white'
      }}
    >
      {addButton}

      {dogs.length > 0 ? (
        <FlatList
          horizontal
          style={styles.container}
          data={dogs}
          renderItem={({ item }) => {
            return (
              <DogListItem
                size={64}
                onDogPress={onDogPress}
                onAddDogPress={onAddDogPress}
                item={item}
              />
            )
          }}
          keyExtractor={(item, index) => item.id || index.toString()}
        />
      ) : (
        <Text style={{ marginLeft: 12, fontSize: 26, fontStyle: 'italic' }}>
          No dogs added yet
        </Text>
      )}
    </View>
  )
}
