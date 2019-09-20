import React, { useState, useEffect } from 'react'
import {
  ScrollView,
  View,
  FlatList,
  TouchableWithoutFeedback
} from 'react-native'
import { Text, Divider, Button, Avatar } from 'react-native-elements'
import firestore from '@react-native-firebase/firestore'
import isEmpty from 'utilities/is-empty'

import acceptInvite from 'utilities/accept-invite'

import LargeLoadingIndicator from 'components/LargeLoadingIndicator'
import useMeetups from 'hooks/useMeetups'

const MeetupsScreen = ({ navigation }) => {
  const { invites, loading } = useMeetups(global.user.uid)

  const createMeetup = () => navigation.navigate('CreateMeetup')

  const showMeetup = invite =>
    navigation.navigate('ViewMeetup', {
      id: invite.id
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
                name: 'NOT ME',
                uid: 'r40337XTxTMxRdXtcoNfbeHuOnu2'
              },
              {
                description: 'My cool new description',
                photoURL:
                  'https://firebasestorage.googleapis.com/v0/b/breed-up.appspot.com/o/r40337XTxTMxRdXtcoNfbeHuOnu2%2Fprofile_img?alt=media&token=8e5cef6a-0d40-4839-a28f-10a6fbf9a9a9',
                uid: 'NOTME',
                name: 'halfjew23'
              }
            ],

            sender: {
              description: 'NOT MINE cool new description',
              photoURL:
                'https://firebasestorage.googleapis.com/v0/b/breed-up.appspot.com/o/r40337XTxTMxRdXtcoNfbeHuOnu2%2Fprofile_img?alt=media&token=8e5cef6a-0d40-4839-a28f-10a6fbf9a9a9',
              uid: 'NOTME',
              name: 'NOTME'
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
      <InvitesList
        invites={invites}
        createMeetup={createMeetup}
        showMeetup={showMeetup}
      />
    </View>
  )
}

const InvitesList = ({ invites, createMeetup, showMeetup }) => {
  return (
    <ScrollView>
      <View style={{ padding: 12 }}>
        <Text
          style={{ alignSelf: 'center', textDecorationLine: 'underline' }}
          h3
        >
          Invites
        </Text>
        <ReceivedInvitesList
          received={invites.received}
          showMeetup={showMeetup}
          handleCreate={createMeetup}
        />
        <Divider style={{ marginVertical: 12, backgroundColor: 'gray' }} />
        <SentInvitesList
          sent={invites.sent}
          showMeetup={showMeetup}
          handleCreate={createMeetup}
        />
        <Divider style={{ marginVertical: 12, backgroundColor: 'gray' }} />
        <UpcomingInvitesList
          upcoming={invites.upcoming}
          showMeetup={showMeetup}
          handleCreate={createMeetup}
        />
      </View>
    </ScrollView>
  )
}

const InvitesSection = ({ invites, title, empty, action, renderItem }) => {
  return (
    <View style={{ marginTop: 12 }}>
      <Text h4>{title}</Text>
      {isEmpty(invites) && (
        <Text onPress={empty.fn} h5>
          {empty.msg}
        </Text>
      )}

      <FlatList
        data={Object.values(invites).sort(
          (invite1, invite2) => invite1.created > invite2.created
        )}
        renderItem={({ item: invite }) => renderItem(invite)}
      />
    </View>
  )
}

const MeetupListItem = ({
  id,
  title,
  photo,
  action,
  onMeetupPress,
  invite
}) => {
  return (
    <TouchableWithoutFeedback onPress={() => onMeetupPress(invite)}>
      <View style={{ flexDirection: 'row', padding: 8 }}>
        <Avatar
          rounded
          size="medium"
          source={{
            uri: photo
          }}
        />
        <Text
          style={{
            paddingLeft: 12
          }}
          key={id}
        >
          {title + '\n'}
        </Text>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text
            style={{ alignSelf: 'flex-end', color: action.color, padding: 4 }}
            onPress={() => {
              action.fn(invite)
            }}
          >
            {`${action.msg}\n`}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const ReceivedInvitesList = ({ received, showMeetup, handleCreate }) => {
  return (
    <InvitesSection
      invites={received}
      title={'Received'}
      empty={{
        msg: 'No invites received, click to create one.',
        fn: handleCreate
      }}
      renderItem={invite => {
        const { id, sender, title } = invite
        return (
          <MeetupListItem
            invite={invite}
            id={id}
            title={`Invite From: ${sender.name}\n${title}`}
            photo={sender.photo}
            action={{ fn: acceptInvite, msg: 'Accept', color: 'green' }}
            onMeetupPress={showMeetup}
          />
        )
      }}
    />
  )
}

const SentInvitesList = ({ sent, handleCreate, showMeetup }) => {
  return (
    <InvitesSection
      invites={sent}
      title={'Sent'}
      empty={{
        fn: handleCreate,
        msg: 'No invites sent, click to create one.'
      }}
      renderItem={invite => {
        const { recipient, title, id } = invite
        return (
          <MeetupListItem
            invite={invite}
            id={id}
            title={`To: ${recipient.name}\n${title}`}
            photo={recipient.photo}
            action={{ msg: 'View', fn: showMeetup, color: 'blue' }}
            onMeetupPress={showMeetup}
          />
        )
      }}
    />
  )
}

const UpcomingInvitesList = ({ upcoming, handleCreate, showMeetup }) => {
  return (
    <InvitesSection
      invites={upcoming}
      title={'Upcoming'}
      empty={{
        fn: handleCreate,
        msg: 'No upcoming meetups, click to create one.'
      }}
      renderItem={invite => {
        const { sender, recipient, title, id } = invite
        return (
          <MeetupListItem
            invite={invite}
            id={id}
            title={`${title}\n${sender.name} & ${recipient.name}'s Meetup!`}
            photo={sender.photo}
            action={{ msg: 'View', fn: showMeetup, color: 'blue' }}
            onMeetupPress={showMeetup}
          />
        )
      }}
    />
  )
}

export default MeetupsScreen
