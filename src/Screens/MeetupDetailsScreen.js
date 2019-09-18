import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import _ from 'lodash'

import Loading from 'components/LargeLoadingIndicator'
import useMeetup from 'hooks/useMeetup'
import formatDate from 'utilities/format-date'

const MeetupDetailsScreen = ({
  /* Fancy destructuring. Do you love it? Hate it? I'm not sure yet... */
  navigation: {
    state: { params },
    setParams
  }
}) => {
  const { meetup, loading, error } = useMeetup(params.id)
  const id = _.get(meetup, 'id', '')

  useEffect(() => {
    setParams({ title: id === '' ? 'Loading' : meetup.title.toString() })
  }, [id])

  if (loading) {
    return <Loading />
  } else {
    return <MeetupDetails meetup={meetup} />
  }
}

const MeetupDetails = ({ meetup }) => (
  <View style={{ padding: 12 }}>
    <Text>description: {meetup.description}</Text>
    <Text>address: {meetup.location.address}</Text>
    <Text>location name: {meetup.location.name}</Text>
    <Text>creator: {meetup.sender.name}</Text>
    <Text>date: {formatDate(meetup.date)}</Text>
    <Text>photo: {meetup.sender.photo}</Text>
  </View>
)

export default MeetupDetailsScreen
