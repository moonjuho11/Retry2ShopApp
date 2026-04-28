
import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import SectionHeader from './SectionHeader'

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calcTimeLeft = () => {
      const now = new Date()
      const midnight = new Date()
      midnight.setHours(24, 0, 0, 0)
      const diff = midnight - now
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft({ hours, minutes, seconds })
    }

    calcTimeLeft()
    const interval = setInterval(calcTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-500 font-medium">Ends in:</span>
      <div className="flex items-center gap-1">
        <span className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-sm tabular-nums">
          {pad(timeLeft.hours)}
        </span>
        <span className="text-red-600 font-bold">:</span>
        <span className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-sm tabular-nums">
          {pad(timeLeft.minutes)}
        </span>
        <span className="text-red-600 font-bold">:</span>
        <span className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-sm tabular-nums">
          {pad(timeLeft.seconds)}
        </span>
      </div>
    </div>
  )
}

export default function FeaturedDeals() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5001/api/products/featured')
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && products.length === 0) return null

  return (
    <section className="py-6 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Deals of the Day</h2>
          <CountdownTimer />
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-48 h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {products.map(product => (
              <div key={product.id} className="flex-shrink-0 w-48">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
