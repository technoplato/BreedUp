import React from 'react'
import { View, Image, TouchableHighlight } from 'react-native'

import styles from './DogListItemStyles'
import RoundImageView from '../RoundImageView'

export default ({ item, onDogPress, size = 48 }) => {
  return (
    <View style={{ paddingHorizontal: size / 8 }}>
      <RoundImageView
        onPress={() => onDogPress(item)}
        size={size}
        source={{ uri: item.imageUri }}
      />
    </View>
  )
}
