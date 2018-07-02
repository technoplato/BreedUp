import React, { Component } from "react";
import { StyleSheet, Button, Text, View } from "react-native";

import { createStackNavigator } from "react-navigation";

class HomeScreen extends Component {
  static navigationOptions = {
    title: "Home",
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Home Screen</Text>
        <Button
          onPress={() => this.props.navigation.navigate('Details')}
          title="Go to details" />
      </View>
    );
  }
}

class DetailsScreen extends Component {
  static navigationOptions = {
    title: "Details",
    headerRight: (
      <Button
        onPress={() => alert('This is a button!')}
        title="Info"
        color="blue"
      />
    )
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Details Screen</Text>
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen
  },
  {
    initialRouteName: "Home"
  }
);

export default class App extends Component {
  render() {
    return <RootStack />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
