import { useState } from 'react'

import moment from 'moment'
import useInterval from './use-interval'

export default createdAt => {
  const delta = moment().diff(createdAt, 'seconds')
  const [elapsed, setElapsed] = useState(delta)

  const minuteOrMore = delta > 60 - 1
  const hourOrMore = delta > 3600 - 1
  let formattedTime
  if (!minuteOrMore) {
    formattedTime = `${delta}s ago`
  } else if (minuteOrMore && !hourOrMore) {
    const minutes = Math.floor(delta / 60)
    formattedTime = `${minutes}m ago`
  } else {
    formattedTime = moment(createdAt).fromNow()
  }

  useInterval(
    () => {
      setElapsed(elapsed + 1)
    },
    1000,
    hourOrMore
  )

  return formattedTime
}
