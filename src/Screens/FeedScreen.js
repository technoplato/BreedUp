import React from "react"
import { View, Text } from "react-native"
import { Icon } from "react-native-elements"

import FeedList from "../Components/FeedList"
import styles from "../Styles/FeedScreenStyles"

export default class FeedScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
          flexDirection: "row",
          height: 80,
          paddingTop: 24 /* only for IOS to give StatusBar Space */
        }}
      >
        <View style={{ width: 24, height: 24 }} />
        <Text style={{ fontSize: 32 }}>FEED</Text>
        <Icon
          containerStyle={{ marginRight: 12 }}
          name="chat"
          color="#000"
          onPress={() => navigation.navigate("Chat")}
        />
      </View>
    )
  })

  render() {
    return (
      <View style={styles.container}>
        <FeedList navigation={this.props.navigation} />
      </View>
    )
  }
}
