
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useSearch } from '../hooks/useSearch'

export default function Navbar() {
  const { cartCount, openDrawer } = useCart()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const { results, loading } = useSearch(searchQuery)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Show dropdown when there are results or loading
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
  }, [searchQuery, results])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowDropdown(false)
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleResultClick = (product) => {
    setShowDropdown(false)
    setSearchQuery('')
    navigate(`/product/${product.id}`)
  }

  const handleCartClick = () => {
    openDrawer()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-white font-bold text-xl tracking-tight">ShopNow</span>
          </Link>

          {/* Search bar - center, grows */}
          <div className="flex-1 max-w-2xl mx-auto hidden sm:block relative" ref={dropdownRef}>
            <form onSubmit={handleSearchSubmit} className="flex">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-l-lg text-sm text-gray-900 focus:outline-none border-0"
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded-r-lg flex items-center justify-center"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Live search dropdown */}
            {showDropdown && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-b-lg z-50 max-h-80 overflow-y-auto border border-gray-100">
                {loading ? (
                  <div className="p-4 text-center text-sm text-gray-400">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-400">No results found</div>
                ) : (
                  results.slice(0, 5).map(product => (
                    <button
                      key={product.id}
                      onClick={() => handleResultClick(product)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.category} · ${Number(product.price).toFixed(2)}</p>
                      </div>
                    </button>
                  ))
                )}
                {results.length > 5 && (
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full p-3 text-center text-sm text-blue-600 hover:bg-blue-50 font-medium"
                  >
                    See all {results.length} results →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            <Link to="/admin" className="text-white text-sm font-medium hover:text-yellow-300 hidden sm:block">
              Admin
            </Link>

            {/* Cart icon with badge */}
            <button
              onClick={handleCartClick}
              className="relative p-2 text-white hover:text-yellow-300"
              aria-label="Open cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="sm:hidden pb-2 relative" ref={undefined}>
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-l-lg text-sm text-gray-900 focus:outline-none border-0"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded-r-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}
