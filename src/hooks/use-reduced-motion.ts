import { useEffect, useState } from 'react'

/**
 * True when the visitor has asked for reduced motion.
 *
 * Starts `true` so nothing animates during hydration — motion is opt-in
 * once we've actually asked the browser, never opt-out after the fact.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}
