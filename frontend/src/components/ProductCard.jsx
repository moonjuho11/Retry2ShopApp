
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useRecentlyViewed } from '../context/RecentlyViewedContext'

// Category color map for pills
const categoryColors = {
  Electronics: 'bg-blue-100 text-blue-700',
  Clothing: 'bg-purple-100 text-purple-700',
  Food: 'bg-green-100 text-green-700',
  Toys: 'bg-yellow-100 text-yellow-700',
  Cooking: 'bg-orange-100 text-orange-700',
  Exercise: 'bg-red-100 text-red-700',
  Office: 'bg-gray-100 text-gray-700',
}

function StarRating({ rating = 4, reviewCount }) {
  const stars = Math.round(rating)
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(i => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-3.5 w-3.5 ${i <= stars ? 'text-yellow-400' : 'text-gray-200'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-gray-400">({reviewCount})</span>
      )}
    </div>
  )
}

export default function ProductCard({ product, showBestSellerBadge = false }) {
  const navigate = useNavigate()
  const { addToCart, openDrawer } = useCart()
  const { addRecentlyViewed } = useRecentlyViewed()

  const handleCardClick = () => {
    addRecentlyViewed(product)
    navigate(`/product/${product.id}`)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product, 1)
    openDrawer()
  }

  const imgSrc = product.imageUrl || product.image
  const categoryColor = categoryColors[product.category] || 'bg-gray-100 text-gray-700'
  const hasDiscount = product.discount && product.discount > 0
  const salePrice = hasDiscount ? product.price * (1 - product.discount / 100) : null
  const reviewCount = product.reviewCount || Math.floor(Math.random() * 300) + 10

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Image container */}
      <div className="relative w-full h-48 overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-t-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Best Seller badge top-left */}
        {showBestSellerBadge && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">
            #1 Best Seller
          </span>
        )}

        {/* Category badge top-right */}
        {product.category && (
          <span className={`absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor}`}>
            {product.category}
          </span>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 truncate text-sm">{product.name}</h3>

        <div className="mt-1">
          <StarRating rating={product.rating || 4} reviewCount={reviewCount} />
        </div>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="text-red-600 font-bold text-sm">${salePrice.toFixed(2)}</span>
              <span className="text-gray-400 text-xs line-through">${Number(product.price).toFixed(2)}</span>
            </>
          ) : (
            <span className="text-gray-900 font-bold text-sm">${Number(product.price).toFixed(2)}</span>
          )}
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 rounded-lg transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
