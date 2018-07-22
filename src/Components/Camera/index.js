import React from "react";
import { View, Button } from "react-native";
import { RNCamera } from "react-native-camera";
import ImagePicker from "react-native-image-picker";

import styles from "./CameraStyle";

export default class Camera extends React.Component {
  state = {
    flash: "off",
    zoom: 0,
    autoFocus: "on",
    type: "back",
    whiteBalance: "auto",
    ratio: "16:9"
  };

  getRatios = async function() {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  };

  toggleFacing() {
    this.setState({
      type: this.state.type === "back" ? "front" : "back"
    });
  }

  takePicture = async function() {
    if (this.camera) {
      this.camera
        .takePictureAsync({
          quality: 0.01
        })
        .then(data => {
          this.props.onNewPhotoUri(data.uri);
        });
    }
  };

  renderCamera() {
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={styles.camera}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        permissionDialogTitle={"Permission to use camera"}
        permissionDialogMessage={
          "We need your permission to use your camera phone"
        }
      />
    );
  }

  renderButtons() {
    return (
      <View style={styles.buttonContainer}>
        <Button title="FLIP" onPress={this.toggleFacing.bind(this)} />
        <Button title="SNAP" onPress={this.takePicture.bind(this)} />
        <Button title="PICK" onPress={this.pickImage.bind(this)} />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderCamera()}
        {this.renderButtons()}
      </View>
    );
  }

  pickImage = () => {
    ImagePicker.launchImageLibrary(null, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        this.props.onNewPhotoUri(response.uri);
      }
    });
  };
}
