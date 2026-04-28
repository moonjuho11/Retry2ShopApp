
import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Reusable section header with optional right-side link
 * @param {string} title - Section title
 * @param {string} [linkText] - Optional link text on the right
 * @param {string} [linkTo] - Optional link target
 */
export default function SectionHeader({ title, linkText, linkTo }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
      {linkText && linkTo && (
        <Link
          to={linkTo}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
        >
          {linkText} →
        </Link>
      )}
    </div>
  )
}
