import React, { Component } from 'react'
import { View, Platform } from 'react-native'
import { Button } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'

export default class PickDateScreen extends Component {
  state = {
    date: Date.now()
  }

  setDate = (event, date) => {
    date = date || this.state.date

    const pickedIso = moment(date).toISOString(true)
    const utc = moment(pickedIso).toISOString(false)

    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      utc,
      date
    })
  }

  render() {
    const { date } = this.state

    return (
      <View>
        <DateTimePicker
          value={date}
          mode={'datetime'}
          display="default"
          onChange={this.setDate}
        />
        <Button
          containerStyle={{ marginTop: 12 }}
          title={'Select Time!'}
          onPress={() => {
            this.props.navigation.state.params.onDateChosen(this.state.utc)
            this.props.navigation.goBack()
          }}
        />
      </View>
    )
  }
}
