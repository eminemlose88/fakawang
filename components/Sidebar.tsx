'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, MessageCircle, BookOpen } from 'lucide-react'

export default function Sidebar({ dict }: { dict: any }) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const navItems = [
    { name: dict.home, path: '/', icon: Home },
    { name: dict.order_search, path: '/order-search', icon: Search },
    { name: '联系客服', path: '/contact', icon: MessageCircle },
    { name: '技术专区', path: '/blog', icon: BookOpen },
  ]

  return (
    <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-16 md:top-20 bottom-0 bg-white/95 backdrop-blur-xl border-r border-gray-100 z-40 overflow-y-auto shadow-sm">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                active
                  ? 'bg-sl-blue/5 text-sl-blue font-bold border-l-4 border-sl-blue shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent'
              }`}
            >
              <Icon size={20} className={active ? 'text-sl-blue' : 'group-hover:text-gray-900'} />
              <span className="text-sm font-medium uppercase tracking-wider">{item.name}</span>
            </Link>
          )
        })}
      </nav>
      
      {/* Optional: Footer info in sidebar */}
      <div className="p-4 border-t border-gray-100 text-xs text-gray-400">
        <p>© 2025 Fakawang 2.0</p>
      </div>
    </aside>
  )
}
