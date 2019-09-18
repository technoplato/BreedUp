import React, { useState, useEffect } from 'react'
import { ScrollView, View, FlatList } from 'react-native'
import { Text, Divider, Button } from 'react-native-elements'
import firestore from '@react-native-firebase/firestore'
import isEmpty from 'utilities/is-empty'
import cancelInvite from 'utilities/cancel-invite'
import acceptInvite from 'utilities/accept-invite'
import cancelMeetup from 'utilities/cancel-meetup'

import MeetupsList from 'components/MeetupsList'
import LargeLoadingIndicator from 'components/LargeLoadingIndicator'
import useMeetups from 'hooks/useMeetups'

const MeetupsScreen = ({ navigation }) => {
  const { invites, values, loading, error } = useMeetups(global.user.uid)

  const createMeetup = () =>
    navigation.navigate('CreateMeetup', {
      onEventAdded: event => console.log(event)
    })

  return (
    <View style={{ flex: 1 }}>
      {loading && <LargeLoadingIndicator />}
      <Button
        onLongPress={() => {
          const ISENTIT = {
            accepted: false,
            created: Date.now(),
            description: 'A',
            id: Date.now().toString(),
            location: {
              address: '1000 Kevstin Dr, Kissimmee, FL 34744, USA',
              coords: {
                name:
                  'Affinity Dental Group, Kevstin Drive, Kissimmee, FL, USA',
                lat: 28.3006442,
                lng: -81.3951572
              },
              uri: {
                android:
                  'geo:28.3006442,-81.3951572?q=Affinity Dental Group, Kevstin Drive, Kissimmee, FL, USA',
                ios:
                  'maps:28.3006442,-81.3951572?q=Affinity Dental Group, Kevstin Drive, Kissimmee, FL, USA'
              }
            },
            participantIds: ['r40337XTxTMxRdXtcoNfbeHuOnu2', 'NOTME'],

            participants: [
              {
                image:
                  'https://firebasestorage.googleapis.com/v0/b/breed-up.appspot.com/o/r40337XTxTMxRdXtcoNfbeHuOnu2%2Fprofile_img?alt=media&token=8e5cef6a-0d40-4839-a28f-10a6fbf9a9a9',
                name: 'halfjew23',
                uid: 'r40337XTxTMxRdXtcoNfbeHuOnu2'
              },
              {
                description: 'My cool new description',
                photoURL:
                  'https://firebasestorage.googleapis.com/v0/b/breed-up.appspot.com/o/r40337XTxTMxRdXtcoNfbeHuOnu2%2Fprofile_img?alt=media&token=8e5cef6a-0d40-4839-a28f-10a6fbf9a9a9',
                uid: 'NOTME',
                username: 'halfjew23'
              }
            ],

            sender: {
              description: 'NOT MINE cool new description',
              photoURL:
                'https://firebasestorage.googleapis.com/v0/b/breed-up.appspot.com/o/r40337XTxTMxRdXtcoNfbeHuOnu2%2Fprofile_img?alt=media&token=8e5cef6a-0d40-4839-a28f-10a6fbf9a9a9',
              uid: 'NOTME',
              username: 'NOTME'
            },

            recipient: {
              image:
                'https://firebasestorage.googleapis.com/v0/b/breed-up.appspot.com/o/r40337XTxTMxRdXtcoNfbeHuOnu2%2Fprofile_img?alt=media&token=8e5cef6a-0d40-4839-a28f-10a6fbf9a9a9',
              name: 'halfjew23',
              uid: 'r40337XTxTMxRdXtcoNfbeHuOnu2'
            },
            title: Date.now()
          }

          firestore()
            .collection('meetups')
            .doc(ISENTIT.id)
            .set(ISENTIT)
        }}
        title="Create Meetup"
        buttonStyle={{
          backgroundColor: 'black'
        }}
        onPress={createMeetup}
      />
      <InvitesList invites={invites} createMeetup={createMeetup} />
      {/*<MeetupsList navigation={props.navigation} />*/}
    </View>
  )
}

const InvitesList = ({ invites, createMeetup }) => {
  return (
    <ScrollView>
      <View style={{ padding: 12 }}>
        <Text
          style={{ alignSelf: 'center', textDecorationLine: 'underline' }}
          h3
        >
          Invites
        </Text>
        <ReceivedInvitesList received={invites.received} />
        <Divider style={{ marginVertical: 12, backgroundColor: 'gray' }} />
        <SentInvitesList sent={invites.sent} handleCreate={createMeetup} />
        <Divider style={{ marginVertical: 12, backgroundColor: 'gray' }} />
        <UpcomingInvitesList
          upcoming={invites.upcoming}
          handleCreate={createMeetup}
        />
      </View>
    </ScrollView>
  )
}

const InvitesSection = ({ invites, title, empty, action }) => {
  return (
    <View style={{ marginTop: 12 }}>
      <Text h4>{title}</Text>
      {isEmpty(invites) && (
        <Text onPress={empty.fn} h5>
          {empty.msg}(
        </Text>
      )}

      <FlatList
        data={Object.values(invites).sort(
          (invite1, invite2) => invite1.created > invite2.created
        )}
        renderItem={({ item }) => {
          return (
            <View>
              <Text key={item.id}>{item.title.toString() + '\n'}</Text>

              <Text
                style={{ color: action.color, padding: 4 }}
                onPress={() => {
                  action.fn(item)
                }}
              >
                {`${action.msg}\n`}
              </Text>
            </View>
          )
        }}
      />
    </View>
  )
}

const ReceivedInvitesList = ({ received }) => {
  return (
    <InvitesSection
      invites={received}
      title={'Received'}
      empty={{ msg: 'No invites received.', fn: () => {} }}
      action={{ fn: acceptInvite, msg: 'Accept', color: 'green' }}
    />
  )
}
const SentInvitesList = ({ sent, cancelInvite, handleCreate }) => {
  return (
    <InvitesSection
      invites={sent}
      title={'Sent'}
      empty={{
        fn: handleCreate,
        msg: 'No invites sent :( (click to create one)'
      }}
      action={{ msg: 'Cancel', fn: cancelInvite, color: 'red' }}
    />
  )
}

const UpcomingInvitesList = ({ upcoming, handleCreate }) => {
  return (
    <InvitesSection
      invites={upcoming}
      title={'Upcoming'}
      empty={{
        fn: handleCreate,
        msg: 'No upcoming meetups, click to create one.'
      }}
      action={{ msg: 'Cancel', fn: cancelMeetup, color: 'red' }}
    />
  )
}

export default MeetupsScreen
