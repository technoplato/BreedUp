import React from 'react'
import { View } from 'react-native'

import FeedList from '../../Components/FeedList'
import styles from './FeedScreenStyles'

export default class Main extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <FeedList navigation={this.props.navigation} />
      </View>
    )
  }
}
