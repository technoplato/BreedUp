import { StyleSheet } from "react-native"

import { Colors } from "../Themes"

export default StyleSheet.create({
  container: {
    paddingTop: 72,
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  topBar: {
    top: 0,
    position: "absolute",
    backgroundColor: Colors.white,
    alignItems: "center",
    width: "100%",
    minHeight: 24,
    paddingTop: 24
  },
  textInput: {
    height: 48,
    padding: 4,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderColor: Colors.black,
    borderWidth: 2,
    width: "80%",
    marginTop: 8
  },
  button: {
    backgroundColor: Colors.black,
    width: 300,
    height: 45,
    marginTop: 12,
    borderRadius: 5
  },
  headerImage: {
    height: 72,
    width: 72,
    backgroundColor: Colors.crimson
  },
  headerText: {
    fontSize: 60,
    color: Colors.darkGrey
  }
})
