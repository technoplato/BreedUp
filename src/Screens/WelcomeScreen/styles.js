import { StyleSheet } from "react-native"
import AppStyles from "../../AppStyles"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 150
  },
  logo: {
    width: 200,
    height: 200
  },
  title: {
    fontSize: AppStyles.fontSet.xlarge,
    fontWeight: "bold",
    color: AppStyles.colorSet.mainThemeForegroundColor,
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center"
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
  signupContainer: {
    width: AppStyles.sizeSet.buttonWidth,
    backgroundColor: AppStyles.colorSet.mainThemeBackgroundColor,
    borderRadius: AppStyles.sizeSet.radius,
    padding: 10,
    borderWidth: 1,
    borderColor: AppStyles.colorSet.mainThemeForegroundColor,
    marginTop: 30
  },
  signupText: {
    color: AppStyles.colorSet.mainThemeForegroundColor
  }
})

export default styles
