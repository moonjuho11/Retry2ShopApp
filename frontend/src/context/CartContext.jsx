
import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

const TAX_RATE = 0.08

export function CartProvider({ children }) {
  // Initialize cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('shopnow_cart')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('shopnow_cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setCartItems([])

  const openDrawer = () => setIsDrawerOpen(true)
  const closeDrawer = () => setIsDrawerOpen(false)

  // Total number of items in cart
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Sum of price * qty (before tax)
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  // Total with tax
  const cartTotal = cartSubtotal * (1 + TAX_RATE)

  // Keep legacy itemCount and subtotal for backwards compat
  const itemCount = cartCount
  const subtotal = cartSubtotal

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartTotal,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        // legacy
        itemCount,
        subtotal,
        TAX_RATE,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
