import React from "react";
import { StyleSheet, View, Button, Dimensions } from "react-native";

import { RNCamera } from "react-native-camera";

import ImagePicker from "react-native-image-picker";

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
          this.setState({
            photoUri: data.uri
          });
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
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };
        console.log("ImagePicker selected: ", source.uri);

        // TODO call through to onPictureUri from props
        // this.setState({
        //   avatarSource: source
        // });
      }
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    backgroundColor: "orange"
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    padding: 24,
    width: "100%",
    justifyContent: "center",
    flexDirection: "row"
  },
  button: {
    padding: 12
  },
  thumb: {
    height: 100,
    width: 100
  }
});
