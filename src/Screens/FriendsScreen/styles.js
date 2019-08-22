import { StyleSheet } from "react-native"
import AppStyles from "../../AppStyles"

const styles = StyleSheet.create({
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
  name: {
    marginLeft: 20,
    alignSelf: "center",
    fontSize: 17,
    fontWeight: "bold",
    flex: 1,
    color: AppStyles.colorSet.mainTextColor
  },
  divider: {
    bottom: 0,
    left: 80,
    right: 10,
    position: "absolute",
    height: 0.5,
    backgroundColor: "#e0e0e0"
  },
  add: {
    alignSelf: "center",
    borderWidth: 0.5,
    borderColor: AppStyles.colorSet.hairlineColor,
    color: AppStyles.colorSet.mainThemeForegroundColor,
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    fontWeight: "normal"
  },
  accept: {
    marginLeft: 10,
    alignSelf: "center",
    borderWidth: 0.5,
    fontWeight: "normal",
    color: AppStyles.colorSet.mainThemeForegroundColor,
    borderColor: AppStyles.colorSet.hairlineColor,
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5
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
