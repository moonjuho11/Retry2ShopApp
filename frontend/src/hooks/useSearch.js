
import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:5001/api'

/**
 * Custom hook: debounced product search
 * @param {string} query - search query string
 * @returns {{ results: Array, loading: boolean, error: string|null }}
 */
export function useSearch(query) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query || query.trim() === '') {
      setResults([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    // 300ms debounce
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/products?search=${encodeURIComponent(query.trim())}`)
        if (!res.ok) throw new Error('Search failed')
        const data = await res.json()
        setResults(data)
      } catch (err) {
        setError(err.message)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return { results, loading, error }
}
