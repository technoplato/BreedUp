import empty from '../utilities/is-empty'
import { Button } from 'react-native-elements'
import React from 'react'

export default ({ staged, onPress }) => {
  if (empty(staged)) return null
  const stagedCount = Object.keys(staged).length

  return (
    <Button
      title={`Show ${stagedCount} New Post${stagedCount === 1 ? '' : 's'}`}
      onPress={onPress}
    />
  )
}
