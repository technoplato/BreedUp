import firestore from '@react-native-firebase/firestore'
import _ from 'lodash'
import faker from 'faker'

export default count => {
  _.times(count, () => {
    firestore()
      .collection('test-posts')
      .add({
        author: {
          photo: faker.image.avatar(),
          uid: faker.random.number().toString(),
          username: faker.name.lastName()
        },
        commentCount: 0,
        created: new Date().getTime(),
        dogs: [],
        id: faker.random.number().toString(),
        likeCount: 0,
        likes: [],
        postPhoto: faker.image.cats(),
        text: faker.lorem.sentence(),
        viewCount: 0
      })
  })
}
