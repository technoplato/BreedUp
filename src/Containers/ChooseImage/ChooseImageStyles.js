import { StyleSheet } from "react-native";

import { Metrics } from "../../Themes";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  thumb: {
    height: Metrics.images.preview,
    width: Metrics.images.preview
  }
});
