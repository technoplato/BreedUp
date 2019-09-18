import React from 'react'
import { Colors } from '../Themes'
import { ActivityIndicator } from 'react-native'

export default () => (
  <ActivityIndicator
    style={{ flex: 1, position: 'absolute', height: '100%', width: '100%' }}
    size="large"
    color={Colors.crimson}
  />
)
