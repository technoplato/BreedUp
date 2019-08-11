import { StyleSheet } from "react-native"
import AppStyles from "../../AppStyles"

const styles = StyleSheet.create({
  modalView: {
    flex: 1
  },
  searchBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  cancelBtn: {
    alignSelf: "center"
  },
  flat: {
    flex: 1
  },
  container: {
    padding: 10,
    alignItems: "center",
    flexDirection: "row"
  },
  photo: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  divider: {
    bottom: 0,
    left: 80,
    right: 10,
    position: "absolute",
    height: 0.5,
    backgroundColor: "#e0e0e0"
  },
  name: {
    marginLeft: 20,
    alignSelf: "center",
    flex: 1,
    fontSize: 17,
    fontWeight: "bold",
    color: AppStyles.colorSet.mainTextColor
  },
  request: {
    alignSelf: "center",
    borderWidth: 0.5,
    borderColor: AppStyles.colorSet.hairlineColor,
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    fontWeight: "normal"
  },
  add: {
    color: AppStyles.colorSet.mainThemeForegroundColor
  },
  sent: {
    color: AppStyles.colorSet.hairlineColor
  },
  accept: {
    color: AppStyles.colorSet.mainThemeForegroundColor
  },
  rightBtncontainer: {
    backgroundColor: AppStyles.colorSet.hairlineColor,
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 20
  },
  rightBtnIcon: {
    alignSelf: "center",
    tintColor: AppStyles.colorSet.mainThemeForegroundColor,
    width: 15,
    height: 15
  }
})

export default styles
