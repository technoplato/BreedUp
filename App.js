import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import {createStackNavigator} from 'react-navigation'

class HomeScreen extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Home Screen
        </Text>
      </View>
    );
  }
}

const RootStack = createStackNavigator({
  Home: HomeScreen
})

export default class App extends Component {
  render() {
    return <RootStack />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
