import { useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDocumentData } from 'react-firebase-hooks/firestore'

export default () => {
  const [authUser, initialising] = useAuthState(auth())
  const [loggedIn, setLoggedIn] = useState(null)
  const uid = authUser ? authUser.uid : null
  let [fetchedUser, loading, error] = useDocumentData(
    firestore().doc(`users/${uid}`)
  )

  fetchedUser = !!authUser ? fetchedUser : null
  global.user = fetchedUser

  useEffect(() => {
    if (!loading) {
      setLoggedIn(!!authUser && !!fetchedUser)
    }
  }, [loading, uid])

  return { loggedIn: loggedIn && !!authUser, loading }
}
