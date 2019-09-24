import React, { useMemo } from 'react'
import { View } from 'react-native'

import RoundImageView from '../RoundImageView'

export default ({ item: dog, onDogPress, size = 48 }) => {
  const { imageUri, name, breed } = dog

  return useMemo(() => {
    return (
      <View style={{ paddingHorizontal: size / 8 }}>
        <RoundImageView
          onPress={() => onDogPress(dog)}
          size={size}
          source={{ uri: imageUri }}
        />
      </View>
    )
  }, [imageUri, name, breed])
}
