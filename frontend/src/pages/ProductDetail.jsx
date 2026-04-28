
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const res = await fetch(`http://localhost:5000/api/products/${id}`)
        if (!res.ok) throw new Error('Product not found')
        const data = await res.json()
        setProduct(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const decrementQty = () => setQuantity(q => Math.max(1, q - 1))
  const incrementQty = () => setQuantity(q => q + 1)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-32">
        <p className="text-red-500 font-medium">{error || 'Product not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-indigo-600 underline text-sm"
        >
          Back to Home
        </button>
      </div>
    )
  }

  // Support both imageUrl (API) and image (legacy)
  const imgSrc = product.imageUrl || product.image

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-400">
        <button onClick={() => navigate('/')} className="hover:text-indigo-600">
          Home
        </button>
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-medium">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Product Image */}
        <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          {product.category && (
            <span className="text-xs text-indigo-600 font-semibold uppercase tracking-widest">
              {product.category}
            </span>
          )}
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 leading-tight">
            {product.name}
          </h1>

          <p className="mt-4 text-3xl font-bold text-indigo-600">
            ${Number(product.price).toFixed(2)}
          </p>

          {product.description && (
            <p className="mt-4 text-gray-600 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Stock info */}
          {product.stock !== undefined && (
            <p className="mt-3 text-sm text-gray-400">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">✓ In stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-500 font-medium">Out of stock</span>
              )}
            </p>
          )}

          {/* Quantity Selector */}
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700 block mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={decrementQty}
                disabled={quantity <= 1}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
              >
                −
              </button>
              <span className="w-10 text-center font-semibold text-lg">{quantity}</span>
              <button
                onClick={incrementQty}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-medium"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`mt-6 w-full py-3 rounded-xl font-semibold text-white text-sm ${
              added ? 'bg-green-500' : 'bg-indigo-600 hover:bg-indigo-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {added ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>

          <button
            onClick={() => navigate('/cart')}
            className="mt-3 w-full py-3 rounded-xl font-semibold text-indigo-600 text-sm border border-indigo-600 hover:bg-indigo-50"
          >
            View Cart
          </button>
        </div>
      </div>
    </div>
  )
}
