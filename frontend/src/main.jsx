
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { RecentlyViewedProvider } from './context/RecentlyViewedContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <RecentlyViewedProvider>
        <App />
      </RecentlyViewedProvider>
    </CartProvider>
  </React.StrictMode>,
)
