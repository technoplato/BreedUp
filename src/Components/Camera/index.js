import React from 'react'
import { View } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { Button } from 'react-native-elements'

import styles from './CameraStyle'

export default class Camera extends React.Component {
  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    type: 'back',
    whiteBalance: 'auto',
    ratio: '16:9'
  }

  toggleFacing() {
    this.setState({
      type: this.state.type === 'back' ? 'front' : 'back'
    })
  }

  toggleFlash() {
    this.setState({
      type: this.state.flash === 'on' ? 'off' : 'on'
    })
  }

  takePicture = async function() {
    if (this.camera) {
      this.camera
        .takePictureAsync({
          quality: 0.01
        })
        .then(data => {
          this.props.onNewPhotoUri(data.uri)
        })
    }
  }

  renderCamera() {
    return (
      <RNCamera
        captureAudio={false}
        ref={ref => {
          this.camera = ref
        }}
        style={styles.camera}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
      />
    )
  }

  renderButtons() {
    return (
      <View style={styles.buttonContainer}>
        <Button
          buttonStyle={{ backgroundColor: 'transparent' }}
          title="FLIP"
          onPress={this.toggleFacing.bind(this)}
        />
        <Button
          buttonStyle={{ backgroundColor: 'transparent' }}
          title="FLASH"
          onPress={this.toggleFlash.bind(this)}
        />
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderCamera()}
        {this.renderButtons()}
      </View>
    )
  }
}
