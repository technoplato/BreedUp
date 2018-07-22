import { StyleSheet } from "react-native";
import { Metrics, Colors } from "../../Themes/";

export default StyleSheet.create({
  container: {
    flex: 1,
    width: Metrics.screenWidth,
    backgroundColor: Colors.orange
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    padding: Metrics.doubleBaseMargin,
    width: Metrics.screenWidth,
    justifyContent: "center",
    flexDirection: "row"
  },
  button: {
    padding: Metrics.baseMargin
  }
});
