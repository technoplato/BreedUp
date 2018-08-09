import React from 'react'
import { View, Text } from 'react-native'

import styles from './CommentListItemStyles'

export default class CommentListItem extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {this.renderText()}
        {this.renderKey()}
      </View>
    )
  }

  renderText = () => {
    const { text } = this.props.item
    return <Text>{text}</Text>
  }

  renderKey = () => {
    const { author } = this.props.item
    return <Text>---{author}</Text>
  }
}
