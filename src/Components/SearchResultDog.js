import React from 'react'
import { Text, TouchableHighlight, View } from 'react-native'

import RoundImageView from './RoundImageView'

export default ({ item, onResultPress }) => {
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
            key={owner.photo}
            size={24}
            source={{ uri: owner.photo }}
          />
          <Text
            style={{ marginLeft: 8, fontWeight: '300', fontSize: 14 }}
          >{`${owner.username}'s ${dog.breed}`}</Text>
        </View>
      </View>
    </TouchableHighlight>
  )
}
