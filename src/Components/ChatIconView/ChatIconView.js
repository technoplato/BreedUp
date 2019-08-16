import React from "react"
import { Image, View } from "react-native"
import AppStyles from "../../AppStyles"
import styles from "./styles"

export default class ChatIconView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isImgErr: false,
      isSecondImgErr: false
    }
  }

  onImageError = () => {
    this.setState({ isImgErr: true })
  }

  render() {
    console.log("rendering chat icon view, props ===> ", this.props)
    console.log("size of participants: ", this.props.participants.length)
    console.log("photos: " + this.props.participants.map(u => u.photoURL))
    return (
      <View style={styles.container}>
        {this.props.participants.length == 0 && (
          <View style={styles.singleParticipation}>
            <Image
              style={styles.singleChatItemIcon}
              source={AppStyles.iconSet.userAvatar}
            />
          </View>
        )}
        {this.props.participants.length == 1 && (
          <View
            style={
              this.props.style ? this.props.style : styles.singleParticipation
            }
          >
            <Image
              style={[styles.singleChatItemIcon, this.props.imageStyle]}
              onError={this.onImageError}
              source={
                this.state.isImgErr == false
                  ? {
                      uri:
                        this.props.participants[0].photoURL ||
                        this.props.participants[0].senderProfileURL
                    }
                  : AppStyles.iconSet.userAvatar
              }
            />
            {this.props.participants[0].online && (
              <View style={styles.onlineMark} />
            )}
          </View>
        )}
        {this.props.participants.length > 1 && (
          <View style={styles.multiParticipation}>
            <Image
              style={[styles.multiPaticipationIcon, styles.bottomIcon]}
              onError={this.onImageError}
              source={
                this.state.isImgErr == false
                  ? { uri: this.props.participants[0].photoURL }
                  : AppStyles.iconSet.userAvatar
              }
            />
            <View style={styles.middleIcon} />
            <Image
              style={[styles.multiPaticipationIcon, styles.topIcon]}
              onError={() => this.setState({ isSecondImgErr: true })}
              source={
                this.state.isSecondImgErr == false
                  ? { uri: this.props.participants[1].photoURL }
                  : AppStyles.iconSet.userAvatar
              }
            />
          </View>
        )}
      </View>
    )
  }
}
