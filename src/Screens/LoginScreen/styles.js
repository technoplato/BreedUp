import { StyleSheet } from "react-native"
import AppStyles from "../../AppStyles"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  or: {
    color: "black",
    marginTop: 40,
    marginBottom: 10
  },
  title: {
    fontSize: AppStyles.fontSet.title,
    fontWeight: "bold",
    color: AppStyles.colorSet.tint,
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
    fontSize: AppStyles.fontSet.content,
    color: AppStyles.colorSet.text
  },
  loginContainer: {
    width: "70%",
    backgroundColor: AppStyles.colorSet.tint,
    borderRadius: AppStyles.styleSet.borderRadius.main,
    padding: 10,
    marginTop: 30
  },
  loginText: {
    color: AppStyles.colorSet.white
  },
  placeholder: {
    color: "red"
  },
  InputContainer: {
    width: AppStyles.styleSet.textInputWidth.main,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: AppStyles.colorSet.grey,
    borderRadius: AppStyles.styleSet.borderRadius.main
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.colorSet.text
  },
  facebookContainer: {
    width: "70%",
    backgroundColor: AppStyles.colorSet.facebook,
    borderRadius: AppStyles.styleSet.borderRadius.main,
    padding: 10,
    marginTop: 30
  },
  facebookText: {
    color: AppStyles.colorSet.white
  }
})

export default styles
