import React, { Component } from "react";
import { StyleSheet, Button, Text, View, Image } from "react-native";
import Camera from "./src/Camera";

import { createStackNavigator } from "react-navigation";

import ImagePicker from "react-native-image-picker";

import firebase from "react-native-firebase";

console.disableYellowBox = ["Unable to symbolicate"];

class HomeScreen extends Component {
  static navigationOptions = {
    title: "Home"
  };

  constructor(props) {
    super(props);

    this.state = {
      camera: false,
      photoUri: "",
      errorMsg: ""
    };

    this.uploadImage = this.uploadImage.bind(this);
  }

  toggleCamera = (args, vargs) => {
    console.log(this.state);
    this.setState({
      camera: !this.state.camera
    });
  };

  renderHome() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Home Screen</Text>
        <Text>{this.state.photoUri || "Take a picture to display URI"}</Text>
        <Text>
          {(this.state.avatarSource && this.state.avatarSource.uri) ||
            "Choose a picture to display URI"}
        </Text>
        <Image
          style={styles.thumb}
          source={{ isStatic: true, uri: this.state.photoUri }}
        />
        <Image
          style={styles.thumb}
          source={{
            isStatic: true,
            uri: this.state.avatarSource && this.state.avatarSource.uri
          }}
        />
        <Button
          onPress={() => {
            this.uploadImage(this.state.photoUri);
          }}
          title="Upload to Firebase Storage!"
        />

        <Button
          onPress={() => {
            this.uploadImage(this.state.avatarSource.uri);
          }}
          title="Upload Library Image to Firebase Storage!"
        />
      </View>
    );
  }

  render() {
    const { camera } = this.state;

    return (
      <View style={styles.container}>
        <Button
          title="Toggle camera"
          onPress={() => this.toggleCamera("args", "vargs")}
        />
        {camera ? <Camera /> : this.renderHome()}
      </View>
    );
  }

  uploadImage = imageUri => {
    console.log("upload");
    if (!imageUri) {
      this.setState({
        errorMsg: "Please snap a photo before attempting to upload."
      });
    } else {
      const storageRef = firebase.storage().ref();

      const testRef = storageRef.child("test.jpg");

      testRef
        .put(imageUri)
        .then(snapshot => {
          console.log("snapshot", snapshot);
          return snapshot.downloadURL;
        })
        .then(url => console.log("URL --->", url));
    }
  };
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

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Camera: Camera
  },
  {
    initialRouteName: "Home"
  }
);

class App extends Component {
  render() {
    return <RootStack />;
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  }
});
