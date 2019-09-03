import React from 'react'
import { FlatList, TouchableOpacity, Image, Text, View } from 'react-native'
import { SearchBar } from 'react-native-elements'
import firebase from '@react-native-firebase/app'
import '@react-native-firebase/database'
import '@react-native-firebase/firestore'
import '@react-native-firebase/auth'
import TextButton from 'react-native-button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ChatIconView from '../../Components/ChatIconView/ChatIconView'
import AppStyles from '../../AppStyles'
import styles from './styles'

const FRIEND = 'friend'
const PENDING_FRIEND = 'pending_friend'

class FriendsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {
      headerLeft: (
        <TouchableOpacity
          style={AppStyles.styleSet.menuBtn.container}
          onPress={() => {
            navigation.openDrawer()
          }}
        >
          <Image
            style={AppStyles.styleSet.menuBtn.icon}
            source={AppStyles.iconSet.menu}
          />
        </TouchableOpacity>
      ),
      headerTitle: (
        <SearchBar
          containerStyle={AppStyles.styleSet.searchBar.container}
          inputStyle={AppStyles.styleSet.searchBar.input}
          showLoading
          clearIcon
          searchIcon
          value={params.keyword}
          onChangeText={text => params.handleSearch(text)}
          onClear={params.handleClear}
          placeholder="Search"
        />
      )
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      heAcceptedFriendships: [],
      hiAcceptedFriendships: [],
      pendingFriendships: [],
      friends: [],
      keyword: '',
      users: [],
      filteredUsers: []
    }

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
  }

  componentDidMount() {
    this.heAcceptedFriendshipssUnsubscribe = this.heAcceptedFriendshipsRef.onSnapshot(
      this.onHeAcceptedFriendShipsCollectionUpdate
    )
    this.iAcceptedFriendshipssUnsubscribe = this.iAcceptedFriendshipsRef.onSnapshot(
      this.onIAcceptedFriendShipsCollectionUpdate
    )
    this.toMePendingFriendshipssUnsubscribe = this.toMePendingFriendshipsRef.onSnapshot(
      this.onPendingFriendShipsCollectionUpdate
    )

    this.props.navigation.setParams({
      handleSearch: this.onSearch,
      handleClear: this.onClear,
      keyword: ''
    })
  }

  componentWillUnmount() {
    this.usersUnsubscribe()
    this.toMePendingFriendshipssUnsubscribe()
    this.heAcceptedFriendshipssUnsubscribe()
    this.iAcceptedFriendshipssUnsubscribe()
  }

  onUsersCollectionUpdate = querySnapshot => {
    const data = []
    querySnapshot.forEach(doc => {
      const user = doc.data()
      user.id = doc.id

      const friendships_1 = this.state.heAcceptedFriendships.filter(friend => {
        return friend.user2 == user.id
      })

      const friendships_2 = this.state.iAcceptedFriendships.filter(friend => {
        return friend.user1 == user.id
      })

      const pending_friendships = this.state.pendingFriendships.filter(
        friend => {
          return friend.user1 == user.id
        }
      )

      if (friendships_1.length > 0) {
        user.friendshipId = friendships_1[0].id
        user.type = FRIEND
        data.push(user)
      } else if (friendships_2.length > 0) {
        user.friendshipId = friendships_2[0].id
        user.type = FRIEND
        data.push(user)
      } else if (pending_friendships.length > 0) {
        user.friendshipId = pending_friendships[0].id
        user.type = PENDING_FRIEND
        data.push(user)
      }
    })

    this.setState({
      users: data,
      filteredUsers: data
    })
  }

  onHeAcceptedFriendShipsCollectionUpdate = querySnapshot => {
    const data = []
    querySnapshot.forEach(doc => {
      const temp = doc.data()
      temp.id = doc.id
      data.push(temp)
    })

    this.setState({
      heAcceptedFriendships: data
    })

    if (this.usersUnsubscribe) this.usersUnsubscribe()

    this.usersRef = firebase.firestore().collection('users')
    this.usersUnsubscribe = this.usersRef.onSnapshot(
      this.onUsersCollectionUpdate
    )
  }

  onIAcceptedFriendShipsCollectionUpdate = querySnapshot => {
    const data = []
    querySnapshot.forEach(doc => {
      const temp = doc.data()
      temp.id = doc.id
      data.push(temp)
    })

    this.setState({
      iAcceptedFriendships: data
    })

    if (this.usersUnsubscribe) this.usersUnsubscribe()

    this.usersRef = firebase.firestore().collection('users')
    this.usersUnsubscribe = this.usersRef.onSnapshot(
      this.onUsersCollectionUpdate
    )
  }

  onPendingFriendShipsCollectionUpdate = querySnapshot => {
    const data = []
    querySnapshot.forEach(doc => {
      const temp = doc.data()
      temp.id = doc.id
      data.push(temp)
    })

    this.setState({
      pendingFriendships: data
    })

    if (this.usersUnsubscribe) this.usersUnsubscribe()

    this.usersRef = firebase.firestore().collection('users')
    this.usersUnsubscribe = this.usersRef.onSnapshot(
      this.onUsersCollectionUpdate
    )
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

  onSearch = text => {
    this.setState({ keyword: text })
    const filteredUsers = this.filteredUsers(text)
    this.setState({ filteredUsers })
    this.props.navigation.setParams({
      keyword: text
    })
  }

  onClear = () => {
    this.setState({ keyword: '' })
    const filteredUsers = this.filteredUsers('')
    this.setState({ filteredUsers })
  }

  onTapBtn = item => {
    if (item.type == FRIEND) {
      this.onUnFriend(item)
    } else {
      this.onAccept(item)
    }
  }

  onUnFriend = item => {
    firebase
      .firestore()
      .collection('friendships')
      .doc(item.friendshipId)
      .delete()
      .then(function(docRef) {
        alert('Successfully unfriend')
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

    firebase
      .firestore()
      .collection('pending_friendships')
      .doc(item.friendshipId)
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

  getBtnText = item => {
    if (item.type == FRIEND) {
      return 'Unfriend'
    }
    return 'Accept'
  }

  onPressFriend = friend => {
    let id1 = firebase.auth().currentUser.uid
    let id2 = friend.id
    let channel = {
      name: friend.username,
      id: id1 < id2 ? id1 + id2 : id2 + id1,
      participants: [firebase.auth().currentUser, friend]
    }

    this.props.navigation.navigate('Chat', { channel: channel })
  }

  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.onPressFriend(item)}>
      <View style={styles.container}>
        <ChatIconView
          style={styles.photo}
          imageStyle={styles.photo}
          participants={[item]}
        />
        <Text style={styles.name}>{item.username}</Text>
        <TextButton style={styles.add} onPress={() => this.onTapBtn(item)}>
          {this.getBtnText(item)}
        </TextButton>
        <View style={styles.divider} />
      </View>
    </TouchableOpacity>
  )

  render() {
    return (
      <KeyboardAwareScrollView>
        <FlatList
          style={styles.flat}
          data={this.state.filteredUsers}
          renderItem={this.renderItem}
          keyExtractor={item => `${item.id}`}
          initialNumToRender={5}
        />
      </KeyboardAwareScrollView>
    )
  }
}

export default FriendsScreen
