import React from 'react'
import { Card, Avatar, Icon, Button } from 'react-native-elements'
import { View, Text, Image } from 'react-native'
import moment from 'moment'

import styles from './FeedCardStyles'

export const FeedCard = props => {
  this.props = props
  return renderCard()
}

renderCard = () => {
  return (
    <Card containerStyle={styles.cardContainer}>
      {renderCardHeader()}
      {renderText()}
      {renderImage()}
      {renderButtons()}
    </Card>
  )
}

renderCardHeader = () => {
  const { author, author_img, time_posted, view_count } = this.props.item
  const time_since_post = moment(time_posted).fromNow()
  return (
    <View style={styles.headerContainer}>
      <View style={styles.imageAndTextContainer}>
        <Avatar rounded size={350} source={{ uri: author_img }} />
        <View style={styles.postMetadata}>
          <Text>{author}</Text>
          <Text>
            {time_since_post} | {view_count}
          </Text>
        </View>
      </View>
      <Icon name="more-vert" containerStyle={styles.moreButton} />
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
  return (
    <View style={styles.buttonContainer}>
      <Button
        buttonStyle={styles.button}
        textStyle={styles.buttonText}
        title="Like"
        icon={{ name: 'thumb-up', color: 'grey' }}
      />
      <Button
        buttonStyle={styles.button}
        textStyle={styles.buttonText}
        title="Comment"
        icon={{ name: 'comment', color: 'grey' }}
      />
      <Button
        buttonStyle={styles.button}
        textStyle={styles.buttonText}
        title="Share"
        icon={{ name: 'share', color: 'grey' }}
      />
    </View>
  )
}
