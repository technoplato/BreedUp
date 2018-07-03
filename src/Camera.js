import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Image
} from "react-native";
import { RNCamera } from "react-native-camera";

import firebase from "react-native-firebase";

export default class Camera extends React.Component {
  state = {
    flash: "off",
    zoom: 0,
    autoFocus: "on",
    depth: 0,
    type: "back",
    whiteBalance: "auto",
    ratio: "16:9",
    ratios: [],
    photoId: 1,
    photos: [],
    photoUri: "",
    errorMsg: ""
  };

  constructor(props) {
    super(props);

    this.uploadImage = this.uploadImage.bind(this);
  }

  getRatios = async function() {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  };

  toggleFacing() {
    this.setState({
      type: this.state.type === "back" ? "front" : "back"
    });
  }

  toggleFlash() {
    this.setState({
      flash: flashModeOrder[this.state.flash]
    });
  }

  setRatio(ratio) {
    this.setState({
      ratio
    });
  }

  toggleWB() {
    this.setState({
      whiteBalance: wbOrder[this.state.whiteBalance]
    });
  }

  setFocusDepth(depth) {
    this.setState({
      depth
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
        style={{
          flex: 0.5
        }}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        focusDepth={this.state.depth}
        permissionDialogTitle={"Permission to use camera"}
        permissionDialogMessage={
          "We need your permission to use your camera phone"
        }
      >
        <View
          style={{
            flex: 0.5,
            backgroundColor: "transparent",
            flexDirection: "row",
            justifyContent: "space-around"
          }}
        >
          <TouchableOpacity
            style={styles.flipButton}
            onPress={this.toggleFacing.bind(this)}
          >
            <Text style={styles.flipText}> FLIP </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={this.toggleFlash.bind(this)}
          >
            <Text style={styles.flipText}> FLASH: {this.state.flash} </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={this.toggleWB.bind(this)}
          >
            <Text style={styles.flipText}> WB: {this.state.whiteBalance} </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 0.4,
            backgroundColor: "transparent",
            flexDirection: "row",
            alignSelf: "flex-end"
          }}
        />
        <View
          style={{
            flex: 0.1,
            backgroundColor: "transparent",
            flexDirection: "row",
            alignSelf: "flex-end"
          }}
        >
          <TouchableOpacity
            style={[
              styles.flipButton,
              styles.picButton,
              { flex: 0.3, alignSelf: "flex-end" }
            ]}
            onPress={this.takePicture.bind(this)}
          >
            <Text style={styles.flipText}> SNAP </Text>
          </TouchableOpacity>
        </View>
      </RNCamera>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderCamera()}
        <Text>{this.state.photoUri || "Take a picture to display URI"}</Text>
        <Image
          style={styles.thumb}
          source={{ isStatic: true, uri: this.state.photoUri }}
        />
        <Button
          onPress={() => {
            this.uploadImage();
          }}
          title="Upload to Firebase Storage!"
        />
      </View>
    );
  }

  uploadImage = () => {
    const imagePath = this.state.photoUri;

    if (!imagePath) {
      this.setState({
        errorMsg: "Please snap a photo before attempting to upload."
      });
    } else {
      const storageRef = firebase.storage().ref();

      const testRef = storageRef.child("test.jpg");

      testRef
        .put(imagePath)
        .then(snapshot => {
          console.log("snapshot", snapshot);
          return snapshot.downloadURL;
        })
        .then(url => console.log("URL --->", url));
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "orange"
  },
  thumb: {
    height: 100,
    width: 100
  },
  navigation: {
    flex: 1
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 8,
    borderColor: "white",
    borderWidth: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  flipText: {
    color: "white",
    fontSize: 15
  },
  item: {
    margin: 4,
    backgroundColor: "indianred",
    height: 35,
    width: 80,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  picButton: {
    backgroundColor: "darkseagreen"
  },
  row: {
    flexDirection: "row"
  }
});
