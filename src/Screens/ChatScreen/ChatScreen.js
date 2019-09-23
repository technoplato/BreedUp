import React from 'react'
import {
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import TextButton from 'react-native-button'
import ActionSheet from 'react-native-actionsheet'
import DialogInput from 'react-native-dialog-input'
import firebase from '@react-native-firebase/app'
import '@react-native-firebase/database'
import '@react-native-firebase/firestore'
import '@react-native-firebase/auth'
import { SafeAreaView } from 'react-navigation'
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
import Autolink from 'react-native-autolink'
import ChatIconView from '../../Components/ChatIconView/ChatIconView'
import AppStyles from '../../AppStyles'
import styles from './styles'
import { Icon } from 'react-native-elements'

class ChatScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const channel = navigation.state.params.channel

    let title = channel.name
    let isOne2OneChannel = false

    if (channel.fromDeepLink) {
      title = 'Loading...'
    }

    if (!title) {
      isOne2OneChannel = true
      title = channel.participants[0].username
    }
    const options = {
      title,
      headerLeft: (
        <Icon
          containerStyle={{ marginLeft: 12 }}
          name="arrow-back"
          color="#000"
          onPress={() => navigation.goBack()}
        />
      )
    }

    if (!isOne2OneChannel) {
      options.headerRight = (
        <TextButton
          style={AppStyles.styleSet.rightNavButton}
          onPress={() => navigation.state.params.onSetting()}
        >
          Settings
        </TextButton>
      )
    }
    return options
  }

  state = {
    isRenameDialogVisible: false,
    threads: [],
    input: '',
    isImageViewerVisible: false,
    tappedImage: []
  }

  async componentDidMount() {
    const { getParam } = this.props.navigation
    let channel = getParam('channel')

    this.currentUid = firebase.auth().currentUser.uid
    this.channelParticipation = firebase
      .firestore()
      .collection('channel_participation')
      .where('channel', '==', channel.id)
    this.usersCollection = firebase.firestore().collection('users')

    if (channel.fromDeepLink) {
      channel = await this.loadFullChannel(channel.id)
    }

    if (!channel) throw 'No channel loaded'

    global.activeChatChannelId = channel.id

    this.threadsRef = firebase
      .firestore()
      .collection('channels')
      .doc(channel.id)
      .collection('threads')
      .orderBy('created', 'desc')

    this.threadsUnscribe = this.threadsRef.onSnapshot(
      this.onThreadsCollectionUpdate
    )
    this.props.navigation.setParams({
      onSetting: this.onSetting,
      channel
    })

    this.setState({ channel })
  }

  async loadFullChannel(channelId) {
    const others = await this.loadParticipants(channelId)
    const { name } = await firebase
      .firestore()
      .collection('channels')
      .doc(channelId)
      .get()
      .then(snap => snap.data())

    return {
      name: name,
      participants: others,
      id: channelId
    }
  }

  /**
   * Loads a list of hydrated user objects
   */
  async loadParticipants(channelId) {
    const ids = await this.loadOtherIds(channelId)

    const userPromises = ids.map(
      id =>
        new Promise((resolve, reject) => {
          this.usersCollection
            .doc(id)
            .get()
            .then(snap => {
              resolve(snap.data())
            })
            .catch(() => reject())
        })
    )

    return await Promise.all(userPromises)
  }

  /**
   * Loads an array of this channel's participants, not including the current user
   */
  async loadOtherIds() {
    return await this.channelParticipation.get().then(snap => {
      const data = []
      snap.forEach(doc => {
        const participantId = doc.data().user
        if (participantId !== this.currentUid) {
          data.push(participantId)
        }
      })
      return data
    })
  }

  componentWillUnmount() {
    this.threadsUnscribe && this.threadsUnscribe()
    global.activeChatChannelId = ''
  }

  existSameSentMessage = (messages, newMessage) => {
    for (let i = 0; i < messages.length; i++) {
      const temp = messages[i]
      if (
        newMessage.senderID === temp.senderID &&
        temp.content === newMessage.content &&
        temp.created === newMessage.created
      ) {
        return true
      }
    }

    return false
  }

  onThreadsCollectionUpdate = querySnapshot => {
    const data = []
    querySnapshot.forEach(doc => {
      const message = doc.data()
      message.id = doc.id

      if (!this.existSameSentMessage(data, message)) {
        data.push(message)
      }
    })

    this.setState({ threads: data })
  }

  onSettingActionDone = index => {
    if (index === 0) {
      this.showRenameDialog(true)
    }

    // else if (index === 1) {
    //   this.onLeave()
    // }
  }

  onConfirmActionDone = index => {
    if (index === 0) {
      firebase
        .firestore()
        .collection('channel_participation')
        .where('channel', '==', this.state.channel.id)
        .where('user', '==', firebase.auth().currentUser)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(function(doc) {
            doc.ref.delete()
          })
          this.props.navigation.goBack(null)
        })
    }
  }

  onSetting = () => {
    this.settingActionSheet.show()
  }

  onLeave = () => {
    this.confirmLeaveActionSheet.show()
  }

  onPressChat = chat => {
    if (chat.url !== '') {
      this.displayChatImage(chat.url)
    }
  }

  displayChatImage = url => {
    const image = [
      {
        source: {
          uri: url
        }
      }
    ]
    this.setState({
      tappedImage: image,
      isImageViewerVisible: true
    })
  }

  createOne2OneChannel = () => {
    const channelData = {
      creator_id: firebase.auth().currentUser.uid,
      name: '',
      lastMessage: this.state.input,
      lastMessageDate: new Date()
    }

    const { uid, username, photo } = global.user
    const that = this

    firebase
      .firestore()
      .collection('channels')
      .add(channelData)
      .then(function(docRef) {
        channelData.id = docRef.id
        channelData.participants = that.state.channel.participants
        that.setState({ channel: channelData })

        const participationData = {
          channel: docRef.id,
          user: firebase.auth().currentUser.uid
        }
        firebase
          .firestore()
          .collection('channel_participation')
          .add(participationData)
        const created = Date.now()
        channelData.participants.forEach(friend => {
          const participationData = {
            channel: docRef.id,
            user: friend.uid
          }
          firebase
            .firestore()
            .collection('channel_participation')
            .add(participationData)

          const data = {
            content: that.state.input,
            created,
            recipientID: friend.uid,
            recipientPhoto: friend.photo,
            senderUsername: username,
            senderID: uid,
            senderPhoto: photo
          }

          firebase
            .firestore()
            .collection('channels')
            .doc(channelData.id)
            .collection('threads')
            .add(data)
            .then(function(docRef) {
              // alert('Successfully sent friend request!');
            })
            .catch(function(error) {
              alert(error)
            })
        })

        that.threadsRef = firebase
          .firestore()
          .collection('channels')
          .doc(channelData.id)
          .collection('threads')
          .orderBy('created', 'desc')
        that.threadsUnscribe = that.threadsRef.onSnapshot(
          that.onThreadsCollectionUpdate
        )

        that.setState({ input: '' })
      })
      .catch(function(error) {
        alert(error)
      })
  }

  // uploadPromise = () => {
  //   const uri = this.state.photo
  //   return new Promise((resolve, reject) => {
  //     const filename = uri.substring(uri.lastIndexOf("/") + 1)
  //     const uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri
  //     firebase
  //       .storage()
  //       .ref(filename)
  //       .putFile(uploadUri)
  //       .then(function(snapshot) {
  //         resolve(snapshot.downloadURL)
  //       })
  //   })
  // }

  _send = () => {
    if (!this.state.channel.id) {
      this.createOne2OneChannel()
    } else {
      const { uid, username, photo } = global.user

      const created = Date.now()
      this.state.channel.participants.forEach(friend => {
        const data = {
          content: this.state.input,
          created,
          recipientFirstName: friend.username,
          recipientID: friend.uid,
          recipientPhoto: friend.photo,
          senderUsername: username,
          senderID: uid,
          senderPhoto: photo
          // url: this.state.downloadUrl
        }

        firebase
          .firestore()
          .collection('channels')
          .doc(this.state.channel.id)
          .collection('threads')
          .add(data)
          .then(function(docRef) {
            // alert('Successfully sent friend request!');
          })
          .catch(function(error) {
            alert(error)
          })
      })

      // let lastMessage = this.state.downloadUrl
      let lastMessage
      if (!lastMessage) {
        lastMessage = this.state.input
      }

      const channel = { ...this.state.channel }

      delete channel.participants
      channel.lastMessage = lastMessage
      channel.lastMessageDate = new Date()

      firebase
        .firestore()
        .collection('channels')
        .doc(this.state.channel.id)
        .set(channel)
      this.setState({ input: '' })
    }
  }

  onSend = () => {
    this._send()
  }

  showRenameDialog = show => {
    this.setState({ isRenameDialogVisible: show })
  }

  onChangeName = text => {
    this.showRenameDialog(false)

    const channel = { ...this.state.channel }
    delete channel.participants
    channel.name = text

    firebase
      .firestore()
      .collection('channels')
      .doc(this.state.channel.id)
      .set(channel)
      .then(() => {
        const newChannel = this.state.channel
        newChannel.name = text
        this.setState({ channel: newChannel })
        this.props.navigation.setParams({
          channel: newChannel
        })
      })
  }

  renderChatItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => this.onPressChat(item)}>
        {item.senderID === firebase.auth().currentUser.uid && (
          <View style={styles.sendItemContainer}>
            <View style={[styles.itemContent, styles.sendItemContent]}>
              <Autolink
                style={styles.sendTextMessage}
                linkStyle={styles.linkTextMessage}
                text={item.content}
                phone={false}
              />
            </View>
            {item.senderPhoto != null && (
              <ChatIconView
                style={styles.userIcon}
                imageStyle={styles.userIcon}
                participants={[item]}
              />
            )}
          </View>
        )}
        {item.senderID !== firebase.auth().currentUser.uid && (
          <View style={styles.receiveItemContainer}>
            <ChatIconView
              style={styles.userIcon}
              imageStyle={styles.userIcon}
              participants={[item]}
            />

            <View style={[styles.itemContent, styles.receiveItemContent]}>
              <Autolink
                style={styles.receiveTextMessage}
                linkStyle={styles.linkTextMessage}
                text={item.content}
                phone={false}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  isDisable = () => {
    return !this.state.input
  }

  sendBtnStyle = () => {
    const style = { padding: 10 }
    if (this.isDisable()) {
      style.opacity = 0.2
    } else {
      style.opacity = 1
    }
    return style
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareView style={styles.chats}>
          <FlatList
            inverted
            vertical
            showsVerticalScrollIndicator={false}
            data={this.state.threads}
            renderItem={this.renderChatItem}
            keyExtractor={item => `${item.id}`}
          />

          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              value={this.state.input}
              multiline
              onChangeText={text => this.setState({ input: text })}
              placeholder="Start typing..."
              underlineColorAndroid="transparent"
            />
            <TouchableOpacity
              disabled={this.isDisable()}
              style={this.sendBtnStyle()}
              onPress={this.onSend}
            >
              <Image style={styles.icon} source={AppStyles.iconSet.share} />
            </TouchableOpacity>
          </View>
        </KeyboardAwareView>
        <ActionSheet
          ref={o => (this.settingActionSheet = o)}
          title="Group Settings"
          options={['Rename Group', 'Cancel']}
          cancelButtonIndex={2}
          onPress={index => {
            this.onSettingActionDone(index)
          }}
        />
        <ActionSheet
          ref={o => (this.confirmLeaveActionSheet = o)}
          title="Are you sure?"
          options={['Confirm', 'Cancel']}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          onPress={index => {
            this.onConfirmActionDone(index)
          }}
        />
        <DialogInput
          isDialogVisible={this.state.isRenameDialogVisible}
          title="Change Name"
          hintInput={this.state.channel ? this.state.channel.name : ''}
          textInputProps={{ selectTextOnFocus: true }}
          submitText="OK"
          submitInput={inputText => {
            this.onChangeName(inputText)
          }}
          closeDialog={() => {
            this.showRenameDialog(false)
          }}
        />
      </SafeAreaView>
    )
  }
}

export default ChatScreen
