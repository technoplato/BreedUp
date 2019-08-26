import * as firebase from "firebase"
import "firebase/firestore"

let config = {
  apiKey: "AIzaSyCv6s27Q6RilNsWYXe6WBkRgfXI3Rt82iE",
  databaseURL: "https://breed-up.firebaseio.com",
  projectId: "breed-up",
  storageBucket: "breed-up.appspot.com",
  messagingSenderId: "26594501375"
}

let app = firebase.initializeApp(config)
const firestore = app.firestore()
export { firestore }
export default app
