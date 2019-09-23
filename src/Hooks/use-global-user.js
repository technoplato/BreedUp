import { useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'

export default () => {
  const [authUser, initialising] = useAuthState(auth())
  const [user, setUser] = useState(null)
  global.user = user
  const [loading, setLoading] = useState(false)
  const uid = authUser ? authUser.uid : null

  useEffect(() => {
    if (!uid) {
      setUser(null)
      return
    }

    setLoading(true)
    const loadUser = async () => {
      const user = await firestore()
        .doc(`users/${uid}`)
        .get()
        .then(snap => snap.data())
      setLoading(false)
      setUser(user)
    }

    loadUser()
  }, [uid])

  return { authUser, initialising, user, loading }
}
