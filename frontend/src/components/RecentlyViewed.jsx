
import React from 'react'
import { useRecentlyViewed } from '../context/RecentlyViewedContext'
import ProductCard from './ProductCard'
import SectionHeader from './SectionHeader'

export default function RecentlyViewed() {
  const { recentlyViewed } = useRecentlyViewed()

  if (!recentlyViewed || recentlyViewed.length === 0) return null

  return (
    <section className="py-6 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Recently Viewed" />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {recentlyViewed.map(product => (
            <div key={product.id} className="flex-shrink-0 w-48">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
