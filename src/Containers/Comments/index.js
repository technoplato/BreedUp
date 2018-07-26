import React from 'react'
import { View, Text } from 'react-native'

/**
 * TODO
 *
 * Create CommentList
 * Add CommentList
 * Implement feedback on CommentList / CommentsScreen
 *
 * Add ability to add comments
 * Only trigger child_added once per new comment (using limitToLast(1))
 */
export default class CommentsScreen extends React.Component {
  render() {
    const commentKey = this.props.navigation.getParam('key', 'NO-ID')

    return (
      <View
        style={{
          justifyContent: 'center',
          flex: 1,
          backgroundColor: 'pink',
          alignItems: 'center'
        }}
      >
        <Text>{commentKey}</Text>
      </View>
    )
  }
}
