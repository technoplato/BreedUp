import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: "#d9d9d9",
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  iosContainer: {
    marginBottom: 4,
    paddingTop: 17,
    paddingBottom: 10
  },
  androidContainer: {
    paddingTop: 7
    // paddingBottom: ,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#a6a6a6"
  },
  error: {
    color: "red",
    marginBottom: 6,
    marginLeft: 5
  },
  textInput: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

export default styles
