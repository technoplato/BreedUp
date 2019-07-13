import React from "react"
import { View } from "react-native"

import FeedList from "../Components/FeedList"
import styles from "../Styles/FeedScreenStyles"

export default class Main extends React.Component {
  static navigationOptions = {
    header: null
  }
  render() {
    return (
      <View style={styles.container}>
        <FeedList navigation={this.props.navigation} />
      </View>
    )
  }
}
