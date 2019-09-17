import React from 'react'
import { Avatar, Button, Card } from 'react-native-elements'
import styles from './FeedCard/FeedCardStyles'
import {
  Alert,
  Image,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import moment from 'moment'
import firebase from '@react-native-firebase/app'
import { Colors } from '../Themes'

export default class PostItem extends React.Component {
  _onPressLike = () => {
    this.props.onPressLike(this.props.id, this.props.liked)
  }

  shouldComponentUpdate({ liked, likeCount, viewCount }) {
    return (
      liked !== this.props.liked ||
      likeCount !== this.props.likeCount ||
      viewCount !== this.props.viewCount
    )
  }

  render() {
    return (
      <Card containerStyle={styles.cardContainer}>
        <View>
          {this.renderCardHeader()}
          {this.renderText()}
          {this.renderImage()}
          {this.renderButtons()}
          {this.renderComments()}
        </View>
      </Card>
    )
  }

  renderCardHeader = () => {
    const { author, created, viewCount } = this.props.item
    const time_since_post = moment(created).fromNow()
    const viewCountSuffix = viewCount === 1 ? 'view' : 'views'

    const dogs = this.props.item.dogs || []
    const numDogs = dogs.length

    const dogNamesText = `Dogs in this image: ${dogs
      .map(dog => dog.name)
      .join(', ')}`

    const text = <Text>{dogNamesText}</Text>

    return (
      <View style={styles.headerContainer}>
        <View style={styles.imageAndTextContainer}>
          <Avatar
            onPress={() => this.props.onAvatarPressed(author)}
            rounded
            size={35}
            source={{ uri: author.photo }}
          />
          <View style={styles.postMetadata}>
            <Text onPress={() => this.props.onAvatarPressed(author)}>
              {author.username}
            </Text>
            <Text>
              {time_since_post} | {viewCount + ' ' + viewCountSuffix}
            </Text>
            {numDogs > 0 && text}
          </View>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'flex-end'
            }}
          >
            <Text
              onPress={() => {
                Alert.alert(
                  'Report post?',
                  'Do you really want to report this post?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel'
                    },
                    {
                      text: 'Yes, report this post',
                      onPress: () => {
                        firebase
                          .firestore()
                          .collection('reported')
                          .add(this.props.item)
                      }
                    }
                  ],
                  { cancelable: false }
                )
              }}
            >
              REPORT
            </Text>
          </View>
        </View>
      </View>
    )
  }

  renderText = () => {
    const { text } = this.props.item
    return !!text ? <Text style={styles.text}>{text}</Text> : null
  }

  renderImage = () => {
    const { postPhoto } = this.props.item
    return (
      <Image
        resizeMode="cover"
        style={styles.image}
        source={{ uri: postPhoto }}
      />
    )
  }

  renderButtons = () => {
    const likeColor = this.props.liked ? Colors.dogBoneBlue : Colors.grey

    return (
      <View style={styles.buttonContainer}>
        <Button
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
          title="Like"
          titleStyle={{ color: likeColor }}
          icon={{ name: 'thumb-up', color: likeColor }}
          onPress={this._onPressLike}
        />
        <Button
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
          title="Comment"
          titleStyle={{ color: 'grey' }}
          icon={{ name: 'comment', color: 'grey' }}
          onPress={() => this.props.onCommentPressed(this.props.item)}
        />
        <Button
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
          title="Share"
          titleStyle={{ color: 'grey' }}
          icon={{ name: 'share', color: 'grey' }}
          onPress={() =>
            this.props.onSharePressed(this.props.item.key, this.props.item.text)
          }
        />
      </View>
    )
  }

  renderComments = () => {
    const { commentCount, first_comment, second_comment } = this.props.item

    const viewAllText = commentCount > 2 && (
      <Text style={{ color: 'rgb(143, 143, 143)', marginBottom: 12 }}>
        View all {commentCount} comments
      </Text>
    )
    const comment1 = first_comment && (
      <Text style={{ marginBottom: 6 }}>
        <Text style={{ fontWeight: 'bold' }}>{first_comment.author} </Text>
        {first_comment.text}
      </Text>
    )
    const comment2 = second_comment && (
      <Text>
        <Text style={{ fontWeight: 'bold' }}>{second_comment.author} </Text>
        {second_comment.text}
      </Text>
    )

    return (
      commentCount > 0 && (
        <TouchableWithoutFeedback
          onPress={() => this.props.onCommentPressed(this.props.item)}
        >
          <View style={{ flexDirection: 'column', padding: 12 }}>
            {viewAllText}
            {comment1}
            {comment2}
          </View>
        </TouchableWithoutFeedback>
      )
    )
  }
}
