import React from 'react'
import {
  FlatList,
  TouchableOpacity,
  Modal,
  Text,
  View,
  Image,
  Keyboard
} from 'react-native'
import { SearchBar } from 'react-native-elements'
import TextButton from 'react-native-button'

import firebase from '@react-native-firebase/app'
import '@react-native-firebase/auth'
import '@react-native-firebase/firestore'

import { SafeAreaView } from 'react-navigation'
import AppStyles from '../../AppStyles'
import styles from './styles'

const REQUEST_NONE = 0
const REQUEST_TO_HIM = 1
const REQUEST_TO_ME = 2

class SearchModal extends React.Component {
  constructor(props) {
    super(props)

    this.usersRef = firebase.firestore().collection('users')
    this.usersUnsubscribe = null

    this.heAcceptedFriendshipsRef = firebase
      .firestore()
      .collection('friendships')
      .where('user1', '==', firebase.auth().currentUser.uid)
    this.heAcceptedFriendshipssUnsubscribe = null

    this.iAcceptedFriendshipsRef = firebase
      .firestore()
      .collection('friendships')
      .where('user2', '==', firebase.auth().currentUser.uid)
    this.iAcceptedFriendshipssUnsubscribe = null

    this.toMePendingFriendshipsRef = firebase
      .firestore()
      .collection('pending_friendships')
      .where('user2', '==', firebase.auth().currentUser.uid)
    this.toMePendingFriendshipssUnsubscribe = null

    this.toHimPendingFriendshipsRef = firebase
      .firestore()
      .collection('pending_friendships')
      .where('user1', '==', firebase.auth().currentUser.uid)
    this.toHimPendingFriendshipssUnsubscribe = null

    this.state = {
      heAcceptedFriendships: [],
      hiAcceptedFriendships: [],
      friends: [],
      keyword: '',
      pendingFriends: [],
      users: [],
      filteredUsers: []
    }
  }

  componentDidMount() {
    this.usersUnsubscribe = this.usersRef.onSnapshot(
      this.onUsersCollectionUpdate
    )
    this.toMePendingFriendshipssUnsubscribe = this.toMePendingFriendshipsRef.onSnapshot(
      this.onPendingFriendShipsCollectionUpdate
    )
    this.toHimPendingFriendshipssUnsubscribe = this.toHimPendingFriendshipsRef.onSnapshot(
      this.onPendingFriendShipsCollectionUpdate
    )
    this.heAcceptedFriendshipssUnsubscribe = this.heAcceptedFriendshipsRef.onSnapshot(
      this.onHeAcceptedFriendShipsCollectionUpdate
    )
    this.iAcceptedFriendshipssUnsubscribe = this.iAcceptedFriendshipsRef.onSnapshot(
      this.onIAcceptedFriendShipsCollectionUpdate
    )
  }

  componentWillUnmount() {
    this.usersUnsubscribe()
    this.toMePendingFriendshipssUnsubscribe()
    this.toHimPendingFriendshipssUnsubscribe()
    this.heAcceptedFriendshipssUnsubscribe()
    this.iAcceptedFriendshipssUnsubscribe()
  }

  onHeAcceptedFriendShipsCollectionUpdate = querySnapshot => {
    const data = []
    querySnapshot.forEach(doc => {
      const temp = doc.data()
      temp.id = doc.id
      data.push(temp)
    })

    const newUsers = this.state.users.map(user => {
      const temp = data.filter(friendship => {
        return friendship.user2 == user.id
      })
      if (temp.length > 0) {
        user.isFriend = true
      }
      return user
    })
    this.setState({
      heAcceptedFriendships: data,
      users: newUsers,
      filteredUsers: newUsers
    })
  }

  onIAcceptedFriendShipsCollectionUpdate = querySnapshot => {
    const data = []
    querySnapshot.forEach(doc => {
      const temp = doc.data()
      temp.id = doc.id
      data.push(temp)
    })

    const newUsers = this.state.users.map(user => {
      const temp = data.filter(friendship => {
        return friendship.user1 == user.id
      })
      if (temp.length > 0) {
        user.isFriend = true
      }
      return user
    })
    this.setState({
      iAcceptedFriendships: data,
      users: newUsers,
      filteredUsers: newUsers
    })
  }

  onPendingFriendShipsCollectionUpdate = querySnapshot => {
    const data = []
    querySnapshot.forEach(doc => {
      const temp = doc.data()
      temp.id = doc.id
      data.push(temp)
    })

    const newUsers = this.state.users.map(user => {
      const temp = data.filter(pending => {
        return pending.user1 == user.id || pending.user2 == user.id
      })
      if (temp.length > 0) {
        user.pendingId = temp[0].id
        if (temp[0].user1 == firebase.auth().currentUser.uid) {
          user.pending = REQUEST_TO_HIM
        } else {
          user.pending = REQUEST_TO_ME
        }
      } else if (!user.pending) {
        user.pending = REQUEST_NONE
      }
      return user
    })

    this.setState({
      pendingFriends: [...this.state.pendingFriends, data],
      users: newUsers,
      filteredUsers: newUsers
    })
  }

  onUsersCollectionUpdate = querySnapshot => {
    const data = []
    querySnapshot.forEach(doc => {
      const user = doc.data()
      if (doc.id != firebase.auth().currentUser.uid) {
        data.push({ ...user, id: doc.id })
      }
    })

    this.setState({
      users: data,
      filteredUsers: data
    })
  }

  filteredUsers = keyword => {
    if (keyword) {
      return this.state.users.filter(user => {
        return (
          user.username &&
          user.username.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
        )
      })
    }
    return this.state.users
  }

  onClear = () => {
    this.setState({ keyword: '' })
    const filteredUsers = this.filteredUsers('')
    this.setState({ filteredUsers })
  }

  onSearch = text => {
    this.setState({ keyword: text })
    const filteredUsers = this.filteredUsers(text)
    this.setState({ filteredUsers })
  }

  onPress = item => {
    this.props.navigation.navigate('Detail', { item })
  }

  onAdd = item => {
    const data = {
      // user1 should be called sender
      user1: global.user.uid,
      user1name: global.user.username,
      user1imageUrl: global.user.photo,
      // user2 should be called recipient
      user2: item.id,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    }
    Keyboard.dismiss()
    firebase
      .firestore()
      .collection('pending_friendships')
      .add(data)
      .then(function(docRef) {
        alert('Successfully sent friend request!')
      })
      .catch(function(error) {
        alert(error)
      })
  }

  onAccept = item => {
    const data = {
      user1: item.id,
      user2: firebase.auth().currentUser.uid
    }
    Keyboard.dismiss()

    firebase
      .firestore()
      .collection('pending_friendships')
      .doc(item.pendingId)
      .delete()
    firebase
      .firestore()
      .collection('friendships')
      .add(data)
      .then(function(docRef) {
        alert('Successfully accept friend request!')
      })
      .catch(function(error) {
        alert(error)
      })
  }

  onPressUser = item => {
    Keyboard.dismiss()
  }

  renderItem = ({ item }) => {
    if (item.photo && item.username) {
      return (
        <TouchableOpacity onPress={() => this.onPressUser(item)}>
          <View style={styles.container}>
            <Image
              style={styles.photo}
              source={
                item.photo ? { uri: item.photo } : AppStyles.iconSet.userAvatar
              }
            />
            <Text style={styles.name}>{item.username}</Text>

            {!item.isFriend && item.pending == REQUEST_NONE && (
              <TextButton
                style={[styles.request, styles.add]}
                onPress={() => this.onAdd(item)}
              >
                Add
              </TextButton>
            )}
            {!item.isFriend && item.pending == REQUEST_TO_ME && (
              <TextButton
                style={[styles.request, styles.accept]}
                onPress={() => this.onAccept(item)}
              >
                Accept
              </TextButton>
            )}
            {!item.isFriend && item.pending == REQUEST_TO_HIM && (
              <TextButton style={[styles.request, styles.sent]} disabled>
                Sent
              </TextButton>
            )}
            <View style={styles.divider} />
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity onPress={() => this.onPressUser(item)}>
          <View style={styles.container}>
            <Text style={styles.name}>{item.username}</Text>

            {!item.isFriend && item.pending == REQUEST_NONE && (
              <TextButton
                style={[styles.request, styles.add]}
                onPress={() => this.onAdd(item)}
              >
                Add
              </TextButton>
            )}
            {!item.isFriend && item.pending == REQUEST_TO_ME && (
              <TextButton
                style={[styles.request, styles.accept]}
                onPress={() => this.onAccept(item)}
              >
                Accept
              </TextButton>
            )}
            {!item.isFriend && item.pending == REQUEST_TO_HIM && (
              <TextButton style={[styles.request, styles.sent]} disabled>
                Sent
              </TextButton>
            )}
            <View style={styles.divider} />
          </View>
        </TouchableOpacity>
      )
    }
  }

  onCancel = () => {
    this.props.onCancel()
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        onRequestClose={this.onCancel}
      >
        <SafeAreaView style={styles.modalView}>
          <View style={styles.searchBar}>
            <SearchBar
              containerStyle={[
                AppStyles.styleSet.searchBar.container,
                { marginLeft: 0 }
              ]}
              inputStyle={[
                AppStyles.styleSet.searchBar.input,
                {
                  color: 'white'
                }
              ]}
              autoFocus
              clearIcon
              searchIcon
              value={this.state.keyword}
              onChangeText={text => this.onSearch(text)}
              onClear={this.onClear}
              placeholder="Search"
            />
            <TextButton
              style={[styles.cancelBtn, AppStyles.styleSet.rightNavButton]}
              onPress={() => this.onCancel()}
            >
              Cancel
            </TextButton>
          </View>
          <FlatList
            style={styles.flat}
            keyboardShouldPersistTaps={'always'}
            data={this.state.filteredUsers}
            renderItem={this.renderItem}
            keyExtractor={item => `${item.id}`}
            initialNumToRender={5}
          />
        </SafeAreaView>
      </Modal>
    )
  }
}

export default SearchModal
