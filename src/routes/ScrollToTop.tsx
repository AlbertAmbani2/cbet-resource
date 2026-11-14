import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const timeout = window.setTimeout(() => {
        const target = document.getElementById(hash.slice(1))
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 250)
      return () => window.clearTimeout(timeout)
    }

    window.scrollTo({ top: 0, left: 0 })
  }, [pathname, hash])

  return null
}
