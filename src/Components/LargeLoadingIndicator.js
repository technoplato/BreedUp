import React from 'react'
import styles from './DogList/DogListStyles'
import { Colors } from '../Themes'
import { ActivityIndicator } from 'react-native'

export default () => (
  <ActivityIndicator
    style={styles.loading}
    size="large"
    color={Colors.crimson}
  />
)
