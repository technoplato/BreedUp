import React from 'react'
import { TouchableWithoutFeedback, Text, View } from 'react-native'
import isEmpty from 'utilities/is-empty'

export default ({ navigation, posts, userId, loading }) => {
  const show = !loading && isEmpty(posts) && userId === global.user.uid
  if (show) {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate('Post')
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ fontSize: 24 }}>
            No Posts Yet, Click to Create One!
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  } else {
    return null
  }
}
