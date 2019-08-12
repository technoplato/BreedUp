import React from "react"
import {
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  View,
  Keyboard
} from "react-native"
import { SearchBar } from "react-native-elements"
import TextButton from "react-native-button"
import firebase from "react-native-firebase"
import ChatIconView from "../../components/ChatIconView/ChatIconView"
import AppStyles from "../../AppStyles"
import styles from "./styles"

const REQUEST_NONE = 0
const REQUEST_TO_HIM = 1
const REQUEST_TO_ME = 2

class SearchScreen extends React.Component {
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
          autoFocus
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

    this.usersRef = firebase.firestore().collection("users")
    this.usersUnsubscribe = null

    this.heAcceptedFriendshipsRef = firebase
      .firestore()
      .collection("friendships")
      .where("user1", "==", firebase.auth().currentUser.uid)
    this.heAcceptedFriendshipssUnsubscribe = null

    this.iAcceptedFriendshipsRef = firebase
      .firestore()
      .collection("friendships")
      .where("user2", "==", firebase.auth().currentUser.uid)
    this.iAcceptedFriendshipssUnsubscribe = null

    this.toMePendingFriendshipsRef = firebase
      .firestore()
      .collection("pending_friendships")
      .where("user2", "==", firebase.auth().currentUser.uid)
    this.toMePendingFriendshipssUnsubscribe = null

    this.toHimPendingFriendshipsRef = firebase
      .firestore()
      .collection("pending_friendships")
      .where("user1", "==", firebase.auth().currentUser.uid)
    this.toHimPendingFriendshipssUnsubscribe = null

    this.state = {
      heAcceptedFriendships: [],
      hiAcceptedFriendships: [],
      friends: [],
      keyword: "",
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
    this.props.navigation.setParams({
      handleSearch: this.onSearch,
      handleClear: this.onClear,
      keyword: ""
    })
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
        return friendship.user2 === user.id
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
        return friendship.user1 === user.id
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
        return pending.user1 === user.id || pending.user2 === user.id
      })
      if (temp.length > 0) {
        user.pendingId = temp[0].id
        if (temp[0].user1 === firebase.auth().currentUser.uid) {
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
      if (doc.id !== firebase.auth().currentUser.uid) {
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
          user.firstName &&
          user.firstName.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
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
    this.setState({ keyword: "" })
    const filteredUsers = this.filteredUsers("")
    this.setState({ filteredUsers })
  }

  onPress = item => {
    this.props.navigation.navigate("Detail", { item })
  }

  onAdd = item => {
    const timeStamp = new Date()
    const data = {
      user1: firebase.auth().currentUser.uid,
      user2: item.id,
      created_at: timeStamp
    }
    Keyboard.dismiss()
    console.log("add tapped", data)
    firebase
      .firestore()
      .collection("pending_friendships")
      .add(data)
      .then(function(docRef) {
        alert("Successfully sent friend request!")
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
      .collection("pending_friendships")
      .doc(item.pendingId)
      .delete()
    firebase
      .firestore()
      .collection("friendships")
      .add(data)
      .then(function(docRef) {
        alert("Successfully accept friend request!")
      })
      .catch(function(error) {
        alert(error)
      })
  }

  onPressUser = item => {
    Keyboard.dismiss()
  }

  renderItem = ({ item }) => {
    if (item.profilePictureURL && item.firstName) {
      return (
        <TouchableOpacity onPress={() => this.onPressUser(item)}>
          <View style={styles.container}>
            <ChatIconView style={styles.chatItemIcon} participants={[item]} />
            <Text style={styles.name}>{item.firstName}</Text>

            {!item.isFriend && item.pending === REQUEST_NONE && (
              <TextButton
                style={[styles.request, styles.add]}
                onPress={() => this.onAdd(item)}
              >
                Add
              </TextButton>
            )}
            {!item.isFriend && item.pending === REQUEST_TO_ME && (
              <TextButton
                style={[styles.request, styles.accept]}
                onPress={() => this.onAccept(item)}
              >
                Accept
              </TextButton>
            )}
            {!item.isFriend && item.pending === REQUEST_TO_HIM && (
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

  render() {
    return (
      <FlatList
        keyboardShouldPersistTaps={"always"}
        data={this.state.filteredUsers}
        renderItem={this.renderItem}
        keyExtractor={item => `${item.id}`}
        initialNumToRender={5}
      />
    )
  }
}

export default SearchScreen
