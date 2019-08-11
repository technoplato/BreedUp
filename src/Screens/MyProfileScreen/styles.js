import { StyleSheet, Dimensions } from "react-native"
import AppStyles from "../../AppStyles"

const { height } = Dimensions.get("window")
const imageSize = height * 0.232
const photoIconSize = imageSize * 0.27

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  buttonContainer: {
    height: 53,
    width: "98%",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  },
  linearGradientContainer: {
    marginTop: 60,
    borderRadius: 25,
    height: 55,
    width: "85%",
    backgroundColor: "purple",
    padding: 10,
    justifyContent: "center",
    alignItems: "center"
    // marginBottom: 45,
  },
  buttonText: {
    color: "white"
  },
  image: {
    width: "100%",
    height: "100%"
  },
  imageBlock: {
    flex: 2,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  imageContainer: {
    height: imageSize,
    width: imageSize,
    borderRadius: imageSize,
    shadowColor: "#006",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    overflow: "hidden"
  },
  formContainer: {
    width: "100%",
    flex: 4,
    alignItems: "center"
  },
  photo: {
    marginTop: imageSize * 0.77,
    marginLeft: -imageSize * 0.29,
    width: photoIconSize,
    height: photoIconSize,
    borderRadius: photoIconSize
  },

  addButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d9d9d9",
    opacity: 0.8,
    zIndex: 2
  },
  closeButton: {
    alignSelf: "flex-end",
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginRight: 15
  },
  closeButton__text: {
    backgroundColor: "transparent",
    fontSize: 35,
    lineHeight: 35,
    color: "#FFF",
    textAlign: "center"
  }
})

export default styles
