import { useState, useEffect } from 'react'
import _ from 'lodash'

export default (item, field, updater) => {
  console.log('L5 item ===', item)
  const [object, setObject] = useState({ ...item })
  const [old, setOld] = useState({ ...object })
  const [error, setError] = useState(null)
  const value = _.get(object, field, null)

  function toggle(field, newVal) {
    setError(null)
    setOld({ ...object })
    const toUpdate = { ..._.set(object, field, newVal) }
    setObject(toUpdate)
  }

  useEffect(() => {
    if (value === null || object === null || error) return

    const doAsyncUpdate = async () => {
      try {
        await updater(old, object)
      } catch (error) {
        setError(error)
        setObject({ ...old })
      }
    }

    doAsyncUpdate()
  }, [value])

  return [toggle, value, error]
}
