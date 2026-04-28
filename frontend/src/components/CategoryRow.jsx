
import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import SectionHeader from './SectionHeader'

// Skeleton loader for product cards
function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-48 bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-7 bg-gray-200 rounded w-full mt-2" />
      </div>
    </div>
  )
}

/**
 * CategoryRow component
 * @param {string} categoryName - Category to fetch and display
 */
export default function CategoryRow({ categoryName }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!categoryName) return
    setLoading(true)
    fetch(`http://localhost:5001/api/products?category=${encodeURIComponent(categoryName)}`)
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [categoryName])

  if (!loading && products.length === 0) return null

  return (
    <section className="py-6 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title={categoryName}
          linkText={`See all in ${categoryName}`}
          linkTo={`/category/${encodeURIComponent(categoryName)}`}
        />

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {loading
            ? [...Array(5)].map((_, i) => <SkeletonCard key={i} />)
            : products.map(product => (
                <div key={product.id} className="flex-shrink-0 w-48">
                  <ProductCard product={product} />
                </div>
              ))
          }
        </div>
      </div>
    </section>
  )
}
