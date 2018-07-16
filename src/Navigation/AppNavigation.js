import { createStackNavigator } from "react-navigation";

import ChooseImage from "../Containers/ChooseImage";

const RootStack = createStackNavigator(
  {
    Home: ChooseImage
  },
  {
    initialRouteName: "Home"
  }
);

export default RootStack;
