import { AppRegistry, YellowBox } from "react-native"
import App from "./src/Screens/App"
YellowBox.ignoreWarnings([
  "Unable to symbolicate",
  "Warning: isMounted(...)",
  "Module RCTImageLoader",
  "Warning: In next release empty",
  "Class RCTCxxModule"
])
AppRegistry.registerComponent("BreedUp", () => App)
