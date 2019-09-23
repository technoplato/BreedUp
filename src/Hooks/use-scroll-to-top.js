import { useRef, useState, useEffect } from 'react'

export default () => {
  const listRef = useRef(null)
  const [doScroll, setDoScroll] = useState(false)

  useEffect(() => {
    if (!doScroll) return
    listRef.current.scrollToOffset({ animated: false, offset: 0 })
  }, [doScroll])

  return [listRef, setDoScroll]
}
