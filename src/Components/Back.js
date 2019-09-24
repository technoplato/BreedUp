import React from 'react'
import { Icon } from 'react-native-elements'
import { withNavigation } from 'react-navigation'

const back = ({ navigation }) => (
  <Icon
    containerStyle={{ marginLeft: 12 }}
    name="arrow-back"
    color="#000"
    onPress={() => navigation.goBack()}
  />
)

export default withNavigation(back)
