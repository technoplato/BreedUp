import React from 'react'
import { FlatList } from 'react-native'

import { FeedCard } from '../FeedCard'

export const FeedList = props => {
  return (
    <FlatList
      extraData={props.extraData}
      data={props.posts}
      renderItem={this.renderItem}
    />
  )
}

renderItem = ({ item }) => {
  return <FeedCard item={item} />
}
