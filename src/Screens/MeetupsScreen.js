import React, { Component } from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-elements'

import MeetupsList from '../Components/MeetupsList'

class MeetupsScreen extends Component {
  render() {
    return (
      <View>
        <Button
          title="Create Meetup"
          buttonStyle={{
            backgroundColor: 'black'
          }}
          onPress={() =>
            this.props.navigation.navigate('CreateMeetup', {
              onEventAdded: event => this.handleEventAdded(event)
            })
          }
        />
        <MeetupsList navigation={this.props.navigation} />
      </View>
    )
  }

  handleEventAdded = event => {
    console.log(event)
  }
}

export default MeetupsScreen
