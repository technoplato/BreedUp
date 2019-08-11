import React from "react"
import {
  Image,
  Text,
  TouchableHighlight,
  TextInput,
  View,
  Platform
} from "react-native"
import styles from "./styles"

export default class ProfileItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value,
      isErrored: false,
      willUpdate: true
    }
  }

  componentDidUpdate() {
    if (this.state.willUpdate) {
      this.setState({ value: this.props.value, willUpdate: false })
    }
  }

  onChangeText = text => {
    const isErrored = this.props.isFieldCurrentlyErrored(text)

    const changedObject = {
      index: this.props.index,
      title: this.props.title,
      value: text,
      isCurrentlyError: isErrored,
      isCompulsory: this.props.isCompulsory
    }

    this.setState({ value: text, isErrored }, () =>
      this.props.onChangeField(changedObject)
    )
  }

  render() {
    return (
      <View
        style={[
          styles.container,
          Platform.OS === "ios" ? styles.iosContainer : styles.androidContainer
        ]}
      >
        {this.state.isErrored === true && <Text style={styles.error}>*</Text>}
        <TextInput
          secureTextEntry={this.props.secureTextEntry}
          style={styles.textInput}
          placeholder={this.props.placeholder}
          onChangeText={this.onChangeText}
          value={this.state.value}
          underlineColorAndroid="transparent"
        />
        <View style={styles.iconContainer}>
          <Image style={styles.icon} source={this.props.IconSource} />
        </View>
      </View>
    )
  }
}
