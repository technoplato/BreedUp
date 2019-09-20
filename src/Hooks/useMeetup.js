import { useDocumentData } from 'react-firebase-hooks/firestore'
import firestore from '@react-native-firebase/firestore'

export default id => {
  const [meetup, loading, error] = useDocumentData(
    firestore()
      .collection('meetups')
      .doc(id)
  )

  return { meetup, loading, error }
}
