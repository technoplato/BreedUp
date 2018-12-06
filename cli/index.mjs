import firebase from 'firebase-admin'
// TODO - figure out how to use code in React Native on CLI
// import FirebaseUtils from '../src/Utils/FirebaseUtils'

const ME = {
  uid: 'JMToo5lrZzMOxTAX8WHPE7t4t5o1',
  username: 'halfjew22',
  profileURL:
    'https://firebasestorage.googleapis.com/v0/b/breed-up.appspot.com/o/JMToo5lrZzMOxTAX8WHPE7t4t5o1%2Fprofile_img?alt=media&token=cb75361e-1d26-4208-84da-d228db9d21f1'
}

import serviceAccount from './serviceAccountKey.json'
const HIGH_UNICODE_VAL = '\uf8ff'

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://breed-up.firebaseio.com'
})

// firebase
//   .database()
//   .ref()
//   .child('names/users')
//   .orderByChild('username')
//   .startAt('halfjew')
//   .endAt('halfjew' + '\uf8ff')
//   .on('value', snap => {
//     const keysArray = Object.keys(snap.val())
//     const results = keysArray.map(key => snap.val()[key])
//     console.log(results)

//     // results.forEach((result, i) => console.log(result['username']))
//   })

// firebase
//   .database()
//   .ref()
//   .child('names/dogs')
//   .orderByChild('dogName')
//   .startAt('asdf')
//   // .endAt('asdf' + HIGH_UNICODE_VAL)
//   .limitToFirst(5)
//   .once('value')
//   .then(snap => {
//     console.log(snap.val())
//     // const keysArray = Object.keys(snap.val() || [])
//     // const results = keysArray.map(key => snap.val()[key])
//     // return results
//   })
