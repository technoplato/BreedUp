import React from 'react'
import { View, StyleSheet } from 'react-native'

export default class Testing extends React.Component {
  static navigatorStyle = {
    drawUnderNavBar: true,
    navBarTranslucent: true
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.red}>
          <View style={styles.orange} />
          <View style={styles.orange} />
        </View>
        <View style={styles.headerImageContainer}>
          <View style={styles.fakeImage} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'blue',
    flex: 1,
    justifyContent: 'space-between'
  },
  red: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red'
  },
  orange: {
    height: 170,
    width: 150,
    backgroundColor: 'orange'
  },
  headerImageContainer: {
    position: 'absolute',
    minHeight: 24,
    paddingTop: 24,
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white'
  },
  fakeImage: {
    height: 75,
    width: 75,
    backgroundColor: 'black'
  }
})
