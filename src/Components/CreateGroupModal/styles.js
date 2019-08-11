import { StyleSheet } from "react-native"
import AppStyles from "../../AppStyles"

const styles = StyleSheet.create({
  modalView: {
    flex: 1
  },
  container: {
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: AppStyles.colorSet.mainSubtextColor
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  rightBtn: {
    position: "absolute",
    top: 15,
    right: 10
  },
  rightBtnText: {
    fontSize: 14,
    color: "#007aff",
    fontWeight: "normal"
  },
  leftBtn: {
    position: "absolute",
    left: 0
  },
  title: {
    flex: 1,
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  photo: {
    height: 40,
    borderRadius: 20,
    width: 40
  },
  name: {
    marginLeft: 20,
    alignSelf: "center",
    flex: 1,
    color: AppStyles.colorSet.mainTextColor
  },
  chatItemIcon: {
    height: 70,
    // borderRadius: 45,
    width: 70
  },
  checkContainer: {},
  checked: {
    width: 30,
    height: 30
  }
})

export default styles
