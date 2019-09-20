import React from 'react'
import { View, Text } from 'react-native'

export default ({ query }) => {
  const text =
    query === '' ? 'Search for a user!' : `No results for '${query}'.`
  return (
    <View>
      <Text
        style={{
          color: 'white',
          fontSize: 28
        }}
      >
        {text}
      </Text>
    </View>
  )
}
