import React from 'react'
import { Text, TouchableHighlight, View } from 'react-native'

import RoundImageView from './RoundImageView'
import DogListItem from './DogListItem'

export default ({ item, onResultPress }) => {
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
          <RoundImageView size={64} source={{ uri: item.owner.photo }} />
          <View style={{ marginLeft: 12, flexDirection: 'column' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 22 }}>
              {item.owner.username}
            </Text>
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
