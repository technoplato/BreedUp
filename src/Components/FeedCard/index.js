import React from 'react'
import { Card, Avatar, Button } from 'react-native-elements'
import { View, Text, Image } from 'react-native'
import moment from 'moment'

import styles from './FeedCardStyles'
import { Colors } from '../../Themes'

export default class FeedCard extends React.Component {
  render() {
    return (
      <Card containerStyle={styles.cardContainer}>
        {this.renderCardHeader()}
        {this.renderText()}
        {this.renderImage()}
        {this.renderButtons()}
      </Card>
    )
  }

  renderCardHeader = () => {
    const { author, author_img, time_posted, view_count } = this.props.item
    const time_since_post = moment(time_posted).fromNow()
    /* We add 1 to the view_count here and take care of that on the backend as a hack */
    const fudgedViewCount = (view_count || 0) + 1
    const viewCountSuffix = fudgedViewCount == 1 ? 'view' : 'views'
    return (
      <View style={styles.headerContainer}>
        <View style={styles.imageAndTextContainer}>
          <Avatar rounded size={350} source={{ uri: author_img }} />
          <View style={styles.postMetadata}>
            <Text>{author}</Text>
            <Text>
              {time_since_post} | {fudgedViewCount + ' ' + viewCountSuffix}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  renderText = () => {
    const { text } = this.props.item
    return <Text style={styles.text}>{text}</Text>
  }

  renderImage = () => {
    const { author_img } = this.props.item
    return (
      <Image
        resizeMode="cover"
        style={styles.image}
        source={{ uri: author_img }}
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
          icon={{ name: 'thumb-up', color: likeColor }}
          onPress={() =>
            this.props.onLikePressed(this.props.item.key, this.props.liked)
          }
        />
        <Button
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
          title="Comment"
          icon={{ name: 'comment', color: 'grey' }}
          onPress={() => this.props.onCommentPressed(this.props.item.key)}
        />
        <Button
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
          title="Share"
          icon={{ name: 'share', color: 'grey' }}
          onPress={() =>
            this.props.onSharePressed(this.props.item.key, this.props.item.text)
          }
        />
      </View>
    )
  }
}
