import React from "react"
import {
  ScrollView,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Platform
} from "react-native"
import firebase from "react-native-firebase"
import Icon from "react-native-vector-icons/Ionicons"
import { Icon as Icon2 } from "react-native-elements"

import AppStyles from "../../AppStyles"
import ChatIconView from "../../Components/ChatIconView/ChatIconView"
import SearchModal from "../../Components/SearchModal/SearchModal"
import CreateGroupModal from "../../Components/CreateGroupModal/CreateGroupModal"
import styles from "./styles"

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Chats",
    headerLeft: (
      <Icon2
        containerStyle={{ marginLeft: 12 }}
        name="arrow-back"
        color="#000"
        onPress={() => {
          navigation.goBack(null)
        }}
      />
    ),
    headerRight: (
      <TouchableOpacity
        style={AppStyles.styleSet.menuBtn.container}
        onPress={() => navigation.state.params.onCreate()}
      >
        <Image
          style={AppStyles.styleSet.menuBtn.icon}
          source={AppStyles.iconSet.inscription}
        />
      </TouchableOpacity>
    )
  })

  constructor(props) {
    console.log(props.navigation.state.params)

    super(props)
    this.state = {
      searchModalVisible: false,
      createGroupModalVisible: false,
      heAcceptedFriendships: [],
      hiAcceptedFriendships: [],
      friends: [],
      chats: [],
      channelParticipations: [],
      channels: [],
      imageErr: false
    }

    this.heAcceptedFriendshipsRef = firebase
      .firestore()
      .collection("friendships")
      .where("user1", "==", firebase.auth().currentUser.uid)
    this.heAcceptedFriendshipsUnsubscribe = null

    this.iAcceptedFriendshipsRef = firebase
      .firestore()
      .collection("friendships")
      .where("user2", "==", firebase.auth().currentUser.uid)
    this.iAcceptedFriendshipsUnsubscribe = null

    this.channelPaticipationRef = firebase
      .firestore()
      .collection("channel_participation")
      .where("user", "==", firebase.auth().currentUser.uid)
    this.channelPaticipationUnsubscribe = null

    this.channelsRef = firebase
      .firestore()
      .collection("channels")
      .orderBy("lastMessageDate", "desc")
    this.channelsUnsubscribe = null
  }

  async componentDidMount() {
    const self = this
    const channel = new firebase.notifications.Android.Channel(
      "test-channel",
      "Test Channel",
      firebase.notifications.Android.Importance.Max
    ).setDescription("My apps test channel")

    firebase.notifications().android.createChannel(channel)

    self.heAcceptedFriendshipsUnsubscribe = this.heAcceptedFriendshipsRef.onSnapshot(
      this.onHeAcceptedFriendShipsCollectionUpdate
    )
    self.iAcceptedFriendshipsUnsubscribe = this.iAcceptedFriendshipsRef.onSnapshot(
      this.onIAcceptedFriendShipsCollectionUpdate
    )
    self.channelPaticipationUnsubscribe = this.channelPaticipationRef.onSnapshot(
      this.onChannelParticipationCollectionUpdate
    )
    self.channelsUnsubscribe = this.channelsRef.onSnapshot(
      this.onChannelCollectionUpdate
    )

    self.props.navigation.setParams({
      onCreate: this.onCreate
    })
  }

  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      {
        cancelable: false
      }
    )
  }

  componentWillUnmount() {
    this.usersUnsubscribe()
    this.heAcceptedFriendshipsUnsubscribe()
    this.iAcceptedFriendshipsUnsubscribe()
    this.channelPaticipationUnsubscribe()
    this.channelsUnsubscribe()
  }

  onUsersCollectionUpdate = querySnapshot => {
    const data = []
    querySnapshot.forEach(doc => {
      const user = doc.data()
      user.id = doc.id

      let friendships_1 = []
      if (this.state.heAcceptedFriendships != null) {
        friendships_1 = this.state.heAcceptedFriendships.filter(friend => {
          return friend.user2 == user.id
        })
      }

      let friendships_2 = []
      if (this.state.iAcceptedFriendships != null) {
        friendships_2 = this.state.iAcceptedFriendships.filter(friend => {
          return friend.user1 == user.id
        })
      }

      if (friendships_1.length > 0) {
        user.friendshipId = friendships_1[0].id
        data.push(user)
      } else if (friendships_2.length > 0) {
        user.friendshipId = friendships_2[0].id
        data.push(user)
      }
    })

    this.setState({
      friends: data
    })

    if (this.usersUnsubscribe) this.usersUnsubscribe()
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

    this.usersRef = firebase.firestore().collection("users")
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

    this.usersRef = firebase.firestore().collection("users")
    this.usersUnsubscribe = this.usersRef.onSnapshot(
      this.onUsersCollectionUpdate
    )
  }

  onChannelParticipationCollectionUpdate = querySnapshot => {
    const data = []
    querySnapshot.forEach(doc => {
      const user = doc.data()
      user.id = doc.id

      if (user.id != firebase.auth().currentUser.uid) {
        data.push(user)
      }
    })

    const channels = this.state.channels.filter(channel => {
      return (
        data.filter(participation => channel.id == participation.channel)
          .length > 0
      )
    })

    this.setState({
      channels,
      channelParticipations: data
    })

    if (this.channelsUnsubscribe) {
      this.channelsUnsubscribe()
    }
    this.channelsUnsubscribe = this.channelsRef.onSnapshot(
      this.onChannelCollectionUpdate
    )
  }

  onChannelCollectionUpdate = querySnapshot => {
    const data = []
    const channelPromiseArray = []
    querySnapshot.forEach(doc => {
      channelPromiseArray.push(
        new Promise((channelResolve, channelReject) => {
          const channel = doc.data()
          channel.id = doc.id
          channel.participants = []
          const filters = this.state.channelParticipations.filter(
            item => item.channel == channel.id
          )
          if (filters.length > 0) {
            firebase
              .firestore()
              .collection("channel_participation")
              .where("channel", "==", channel.id)
              .onSnapshot(participationSnapshot => {
                const userPromiseArray = []
                participationSnapshot.forEach(participationDoc => {
                  const participation = participationDoc.data()
                  participation.id = participationDoc.id
                  if (participation.user != firebase.auth().currentUser.uid) {
                    userPromiseArray.push(
                      new Promise((userResolve, userReject) => {
                        firebase
                          .firestore()
                          .collection("users")
                          .doc(participation.user)
                          .get()
                          .then(user => {
                            const userData = user.data()
                            userData.id = user.id
                            userData.participationId = participation.id
                            channel.participants = [
                              ...channel.participants,
                              userData
                            ]
                            userResolve()
                          })
                      })
                    )
                  }
                })
                Promise.all(userPromiseArray).then(values => {
                  data.push(channel)
                  channelResolve()
                })
              })
          } else {
            channelResolve()
          }
        })
      )
    })

    Promise.all(channelPromiseArray).then(values => {
      const sortedData = data.sort((a, b) => {
        return b.lastMessageDate - a.lastMessageDate
      })

      this.setState({
        channels: sortedData
      })
    })
  }

  onCreate = () => {
    this.setState({ createGroupModalVisible: true })
  }

  onPressFriend = friend => {
    const one2OneChannel = this.state.channels.filter(channel => {
      return (
        channel.participants.length == 1 &&
        !channel.name &&
        channel.participants[0].id == friend.id
      )
    })
    let channel
    if (one2OneChannel.length > 0) {
      channel = one2OneChannel[0]
    } else {
      channel = {
        name: "",
        id: null,
        participants: [friend]
      }
    }

    this.props.navigation.navigate("Chat", { channel })
  }

  renderFriendItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => this.onPressFriend(item)}>
        <View style={styles.friendItemContainer}>
          <ChatIconView style={styles.chatItemIcon} participants={[item]} />
          <Text style={styles.friendName}>{item.username}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderFriendSeparator = () => {
    return <View style={styles.friendDivider} />
  }

  onPressChat = chat => {
    this.props.navigation.navigate("Chat", { channel: chat })
  }

  formatMessage = item => {
    if (item.lastMessage.startsWith("https://firebasestorage.googleapis.com")) {
      return "Someone sent a photo."
    }
    return item.lastMessage
  }

  renderChatItem = ({ item }) => {
    let title = item.name
    if (!title) {
      if (item.participants.length > 0) {
        title = item.participants[0].username
      }
    }
    return (
      <TouchableOpacity onPress={() => this.onPressChat(item)}>
        <View style={styles.chatItemContainer}>
          <ChatIconView
            style={styles.chatItemIcon}
            participants={item.participants}
          />
          <View style={styles.chatItemContent}>
            <Text style={styles.chatFriendName}>{title}</Text>
            <View style={styles.content}>
              <Text
                numberOfLines={1}
                ellipsizeMode="middle"
                style={styles.message}
              >
                {this.formatMessage(item)} ·{" "}
                {Platform.OS === "ios"
                  ? AppStyles.utils.timeFormatIos(item.lastMessageDate)
                  : AppStyles.utils.timeFormatAndroid(item.lastMessageDate)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  onTapSearch = () => {
    this.setState({ searchModalVisible: true })
  }

  onSearchCancel = () => {
    this.setState({ searchModalVisible: false })
  }

  onCreateGroupCancel = () => {
    this.setState({ createGroupModalVisible: false })
  }

  render() {
    return (
      <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
        <TouchableOpacity onPress={this.onTapSearch}>
          <View style={styles.searchSection}>
            <Icon
              style={styles.searchIcon}
              name="ios-search"
              size={15}
              color={AppStyles.colorSet.inputBgColor}
            />
            <Text style={styles.input}>Search</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.friends}>
          <FlatList
            horizontal
            initialNumToRender={4}
            ItemSeparatorComponent={this.renderFriendSeparator}
            data={this.state.friends}
            showsHorizontalScrollIndicator={false}
            renderItem={this.renderFriendItem}
            keyExtractor={item => `${item.id}`}
          />
        </View>
        <View style={styles.chats}>
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            data={this.state.channels}
            renderItem={this.renderChatItem}
            keyExtractor={item => `${item.id}`}
          />
        </View>
        {this.state.searchModalVisible && (
          <SearchModal
            categories={this.state.categories}
            onCancel={this.onSearchCancel}
          />
        )}
        {this.state.createGroupModalVisible && (
          <CreateGroupModal onCancel={this.onCreateGroupCancel} />
        )}
      </ScrollView>
    )
  }
}

export default HomeScreen
