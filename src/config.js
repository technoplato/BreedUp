import * as firebase from 'firebase'

let config = {
  apiKey: 'AIzaSyCv6s27Q6RilNsWYXe6WBkRgfXI3Rt82iE',
  databaseURL: 'https://breed-up.firebaseio.com',
  projectId: 'breed-up',
  storageBucket: 'breed-up.appspot.com',
  messagingSenderId: '26594501375'
}

let app = firebase.initializeApp(config, 'klajsdfkjasdfk', 1234)
export const database = app.database()
export default app
