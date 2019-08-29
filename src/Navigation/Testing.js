import React from 'react'
import { searchNearbyUsers } from '../Interactors/Search'
import { Button, Text, View } from 'react-native'

export default class Testing extends React.Component {
  async componentDidMount() {
    const users = await searchNearbyUsers('flori')
    this.setState({ users: users || [] })
  }

  state = { users: [] }

  render() {
    return (
      <View style={{ paddingTop: 40 }}>
        {this.state.users.length == 0 && (
          <Text style={{ marginTop: 24, fontSize: 23 }}>EMPTY</Text>
        )}
        {this.state.users.map(u => (
          <Text style={{ marginTop: 24, fontSize: 23 }}>
            {JSON.stringify(u)}
          </Text>
        ))}
        <Button
          title="butt"
          onPress={() => {
            console.log('clicked')
          }}
        />
      </View>
    )
  }
}
