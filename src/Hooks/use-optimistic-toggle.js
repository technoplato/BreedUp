import { useState, useEffect } from 'react'
import _ from 'lodash'

export default updater => {
  const [object, setObject] = useState(null)
  const [old, setOld] = useState(null)
  const [go, setGo] = useState(null)
  const [field, setField] = useState(null)
  const [error, setError] = useState(null)

  const value = _.get(object, field, null)

  function toggle(obj, field, newVal) {
    if (!newVal) {
      newVal = !_.get(obj, field, false)
    }
    setField(field)
    setError(null)
    setOld({ ...obj })
    const toUpdate = { ..._.set(obj, field, newVal) }
    setObject(toUpdate)
    setGo(true)
  }

  useEffect(() => {
    if (!go) return

    const doAsyncUpdate = async () => {
      try {
        await updater(old, object)
        setOld({ ...object })
      } catch (error) {
        setError(error)
        setObject({ ...old })
      } finally {
        setGo(false)
      }
    }

    doAsyncUpdate()
  }, [go])

  return [toggle, value, error]
}
