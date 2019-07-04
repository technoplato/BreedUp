import React from "react"
import { Card, Avatar, Button } from "react-native-elements"
import { View, Text, Image, TouchableWithoutFeedback } from "react-native"
import moment from "moment"

import styles from "./FeedCardStyles"
import { Colors } from "../../Themes"

export default class FeedCard extends React.Component {
  render() {
    return (
      <Card containerStyle={styles.cardContainer}>
        {this.renderCardHeader()}
        {this.renderText()}
        {this.renderImage()}
        {this.renderButtons()}
        {this.renderComments()}
      </Card>
    )
  }

  renderCardHeader = () => {
    const {
      author_username,
      author_img_url,
      time_posted,
      view_count
    } = this.props.item
    const time_since_post = moment(time_posted).fromNow()
    /* We add 1 to the view_count here and take care of that on the backend as a hack */
    const fudgedViewCount = (view_count || 0) + 1
    const viewCountSuffix = fudgedViewCount == 1 ? "view" : "views"

    const dogs = this.props.item.dogs || []
    const numDogs = dogs.length

    const dogNamesText = `Dogs in this image: ${dogs
      .map(dog => dog.name)
      .join(", ")}`
    const dogNameTextView = numDogs && <Text>{dogNamesText}</Text>

    return (
      <View style={styles.headerContainer}>
        <View style={styles.imageAndTextContainer}>
          <Avatar
            onPress={() =>
              this.props.onAvatarPressed(
                this.props.item.author_id,
                this.props.item.author_username
              )
            }
            rounded
            size={350}
            source={{ uri: author_img_url }}
          />
          <View style={styles.postMetadata}>
            <Text
              onPress={() =>
                this.props.onAvatarPressed(
                  this.props.item.author_id,
                  this.props.item.author_username
                )
              }
            >
              {author_username}
            </Text>
            <Text>
              {time_since_post} | {fudgedViewCount + " " + viewCountSuffix}
            </Text>
            {dogNameTextView}
          </View>
        </View>
      </View>
    )
  }

  renderText = () => {
    const { text } = this.props.item
    return text && <Text style={styles.text}>{text}</Text>
  }

  renderImage = () => {
    const { post_img } = this.props.item
    return (
      <Image
        resizeMode="cover"
        style={styles.image}
        source={{ uri: post_img }}
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
          icon={{ name: "thumb-up", color: likeColor }}
          onPress={() =>
            this.props.onLikePressed(this.props.item.key, this.props.liked)
          }
        />
        <Button
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
          title="Comment"
          icon={{ name: "comment", color: "grey" }}
          onPress={() => this.props.onCommentPressed(this.props.item)}
        />
        <Button
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
          title="Share"
          icon={{ name: "share", color: "grey" }}
          onPress={() =>
            this.props.onSharePressed(this.props.item.key, this.props.item.text)
          }
        />
      </View>
    )
  }

  renderComments = () => {
    const { comment_count, first_comment, second_comment } = this.props.item

    const viewAllText = comment_count > 2 && (
      <Text style={{ color: "rgb(143, 143, 143)", marginBottom: 12 }}>
        View all {comment_count} comments
      </Text>
    )
    const comment1 = first_comment && (
      <Text style={{ marginBottom: 6 }}>
        <Text style={{ fontWeight: "bold" }}>{first_comment.author} </Text>
        {first_comment.text}
      </Text>
    )
    const comment2 = second_comment && (
      <Text>
        <Text style={{ fontWeight: "bold" }}>{second_comment.author} </Text>
        {second_comment.text}
      </Text>
    )

    return (
      comment_count > 0 && (
        <TouchableWithoutFeedback
          onPress={() => this.props.onCommentPressed(this.props.item)}
        >
          <View style={{ flexDirection: "column", padding: 12 }}>
            {viewAllText}
            {comment1}
            {comment2}
          </View>
        </TouchableWithoutFeedback>
      )
    )
  }
}
