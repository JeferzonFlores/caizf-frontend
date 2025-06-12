import * as React from 'react'

const breakpoints = {
  xs: '(max-width: 640px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
}

export function useBreakpoint(breakpoint: keyof typeof breakpoints) {
  const query = breakpoints[breakpoint]
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    const handleChange = () => setMatches(mediaQuery.matches)
    handleChange()

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [query])

  return matches
}
