import { MutableRefObject, useEffect, useState } from 'react'

export function useOnScreen(ref: MutableRefObject<HTMLDivElement | undefined>) {
  const [isIntersecting, setIntersecting] = useState(false)

  const observer = new IntersectionObserver(([entry]) =>
    setIntersecting(entry.isIntersecting)
  )

  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current)
      return () => {
        observer.disconnect()
      }
    } else {
      return () => {
        observer.disconnect()
      }
    }
  }, [ref])

  return isIntersecting
}
