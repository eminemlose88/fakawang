'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header({ title, dict }: { title: string, dict: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20 items-center">
          <div className="flex items-center flex-1 justify-between sm:justify-start">
            <div className="flex-shrink-0 flex items-center gap-3 group cursor-pointer">
              <Link href="/" className="flex items-center gap-2 md:gap-3">
                {/* Logo Icon with Glow */}
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#FFB6C1] rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" className="md:w-6 md:h-6">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                {/* Title Text */}
                <span className="text-lg md:text-2xl font-black tracking-tighter text-gray-900 uppercase group-hover:text-sl-blue transition-colors duration-300">
                  {title}
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation Removed - Moved to Sidebar */}

            {/* Mobile/Tablet Menu Button (Visible on screens smaller than lg) */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              {dict.home}
            </Link>
            <Link
              href="/order-search"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              {dict.order_search}
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              联系客服
            </Link>
            <Link
              href="/blog"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              技术专区
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
