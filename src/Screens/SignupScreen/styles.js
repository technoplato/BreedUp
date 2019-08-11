import { StyleSheet } from "react-native"
import AppStyles from "../../AppStyles"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: AppStyles.fontSet.xlarge,
    fontWeight: "bold",
    color: AppStyles.colorSet.mainThemeForegroundColor,
    marginTop: 20,
    marginBottom: 20
  },
  leftTitle: {
    alignSelf: "stretch",
    textAlign: "left",
    marginLeft: 20
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: "center",
    fontSize: AppStyles.fontSet.middle,
    color: AppStyles.colorSet.mainThemeForegroundColor
  },
  loginContainer: {
    width: AppStyles.sizeSet.buttonWidth,
    backgroundColor: AppStyles.colorSet.mainThemeForegroundColor,
    borderRadius: AppStyles.sizeSet.radius,
    padding: 10,
    marginTop: 30
  },
  loginText: {
    color: AppStyles.colorSet.mainThemeBackgroundColor
  },
  placeholder: {
    color: "red"
  },
  InputContainer: {
    width: AppStyles.sizeSet.inputWidth,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: "solid",
    alignSelf: "center",
    borderRadius: AppStyles.sizeSet.radius
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.colorSet.mainTextColor
  },
  facebookContainer: {
    alignSelf: "center",
    width: AppStyles.sizeSet.buttonWidth,
    backgroundColor: AppStyles.colorSet.mainThemeForegroundColor,
    borderRadius: AppStyles.sizeSet.radius,
    padding: 10,
    marginTop: 30
  },
  facebookText: {
    color: AppStyles.colorSet.mainThemeBackgroundColor
  }
})

export default styles
