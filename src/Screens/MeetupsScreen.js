import React, { useState, useEffect } from 'react'
import { ScrollView, View, FlatList } from 'react-native'
import { Text, Divider, Button } from 'react-native-elements'
import firestore from '@react-native-firebase/firestore'
import isEmpty from 'utilities/is-empty'
import cancelInvite from 'utilities/cancel-invite'

import MeetupsList from 'components/MeetupsList'
import LargeLoadingIndicator from 'components/LargeLoadingIndicator'
import useMeetups from 'hooks/useMeetups'

const MeetupsScreen = ({ navigation }) => {
  const { invites, values, loading, error } = useMeetups(global.user.uid)

  const sorted =
    (values && values.sort((i1, i2) => i1.created < i2.created)) || []

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

            recipient: {
              description: 'NOT MINE cool new description',
              photoURL:
                'https://firebasestorage.googleapis.com/v0/b/breed-up.appspot.com/o/r40337XTxTMxRdXtcoNfbeHuOnu2%2Fprofile_img?alt=media&token=8e5cef6a-0d40-4839-a28f-10a6fbf9a9a9',
              uid: 'NOTME',
              username: 'NOTME'
            },

            sender: {
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
  console.log('RENDERING', invites)
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

const ReceivedInvitesList = ({ received }) => {
  const empty = isEmpty(received)
  return (
    <View>
      <Text h4>Received</Text>
      {empty && <Text h5>No invites received :(</Text>}

      <FlatList
        data={received}
        renderItem={meetup => (
          <View>
            <Text key={meetup.id}>{meetup.title + '\n'}</Text>

            <Text
              style={{ color: 'green', padding: 4 }}
              onPress={() => {
                acceptInvite(item)
              }}
            >
              {'Accept \n'}
            </Text>
          </View>
        )}
      />
    </View>
  )
}

const SentInvitesList = ({ sent, handleCreate }) => {
  const empty = isEmpty(sent)

  return (
    <View>
      <Text h4>Sent</Text>
      {empty && (
        <Text h5 onPress={handleCreate}>
          No invites sent :( (click to create one)
        </Text>
      )}

      <FlatList
        data={Object.values(sent).sort((i1, i2) => i1.created < i2.created)}
        renderItem={({ item }) => {
          return (
            <View>
              <Text key={item.id}>{'Sent: ' + item.title}</Text>
              <Text
                style={{ color: 'red', padding: 4 }}
                onPress={() => {
                  cancelInvite(item)
                }}
              >
                {'Cancel \n'}
              </Text>
            </View>
          )
        }}
      />
    </View>
  )
}

const UpcomingInvitesList = ({ upcoming, handleCreate }) => {
  const empty = isEmpty(upcoming)

  return (
    <View>
      <Text h4>Upcoming</Text>
      {empty && (
        <Text h5 onPress={handleCreate}>
          No events :( (click to create one)
        </Text>
      )}
      {Object.values(upcoming).map(meetup => (
        <Text key={meetup.id}>{meetup.title + '\n'}</Text>
      ))}
    </View>
  )
}

const useMeetupsOld = uid => {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)
  const [invites, setInvites] = useState({})

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('meetups')
      .where('participantIds', 'array-contains', uid)
      .onSnapshot(
        snapshot => {
          snapshot.forEach(doc => {
            const meetup = doc.data()
            invites[meetup.id] = meetup
          })

          setLoading(false)
          setInvites(invites)
        },
        err => {
          setError(err)
        }
      )

    return () => unsubscribe()
  }, [uid])

  return { loading, invites, error }
}

export default MeetupsScreen
