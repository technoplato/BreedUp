import React from 'react'
import { View } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import firebase from '@react-native-firebase/app'

export default class Testing extends React.Component {
  componentDidMount(): void {
    // firestore()
    //   .collection('posts')
    //   .get()
    //   .then(posts => {
    //     posts.forEach(doc => {
    //       const {
    //         author_id: uid,
    //         author_img_url: photo,
    //         author_username: username
    //       } = doc.data()
    //       doc.ref.update({
    //         author: { username, photo, uid },
    //         author_id: firebase.firestore.FieldValue.delete(),
    //         author_img_url: firebase.firestore.FieldValue.delete(),
    //         author_username: firebase.firestore.FieldValue.delete()
    //       })
    //     })
    //   })
  }

  render() {
    return <View style={{ paddingTop: 100 }}></View>
  }
}
