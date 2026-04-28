
import React, { createContext, useContext, useState, useEffect } from 'react'

const RecentlyViewedContext = createContext(null)

const MAX_ITEMS = 8
const STORAGE_KEY = 'shopnow_recently_viewed'

export function RecentlyViewedProvider({ children }) {
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed))
  }, [recentlyViewed])

  const addRecentlyViewed = (product) => {
    if (!product || !product.id) return
    setRecentlyViewed(prev => {
      // Remove duplicate if exists
      const filtered = prev.filter(p => p.id !== product.id)
      // Add to front, keep max 8
      return [product, ...filtered].slice(0, MAX_ITEMS)
    })
  }

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext)
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider')
  return ctx
}
