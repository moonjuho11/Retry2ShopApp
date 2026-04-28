
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const slides = [
  {
    id: 1,
    bg: 'from-blue-600 to-blue-400',
    headline: 'Next-Gen Electronics',
    subtext: 'Discover cutting-edge gadgets and tech accessories at unbeatable prices.',
    cta: 'Shop Electronics',
    link: '/category/Electronics',
  },
  {
    id: 2,
    bg: 'from-yellow-500 to-orange-400',
    headline: 'Fresh Deals Every Day',
    subtext: 'Up to 30% off on top brands. Limited time offers you don\'t want to miss.',
    cta: 'See All Deals',
    link: '/search?q=deals',
  },
  {
    id: 3,
    bg: 'from-green-600 to-teal-400',
    headline: 'Fitness & Wellness',
    subtext: 'Gear up for your best performance. Premium exercise equipment & more.',
    cta: 'Shop Exercise',
    link: '/category/Exercise',
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()

  // Auto-rotate every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const slide = slides[current]

  return (
    <div className="relative w-full h-80 overflow-hidden">
      {slides.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 bg-gradient-to-r ${s.bg} transition-opacity duration-700 ${idx === current ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-white font-bold text-3xl md:text-5xl drop-shadow-md mb-3">
          {slide.headline}
        </h1>
        <p className="text-white/90 text-base md:text-lg max-w-xl mb-6">
          {slide.subtext}
        </p>
        <button
          onClick={() => navigate(slide.link)}
          className="bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg text-sm"
        >
          {slide.cta}
        </button>
      </div>

      {/* Dot navigation */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${idx === current ? 'bg-white scale-125' : 'bg-white/50'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
