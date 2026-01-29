'use client'

import { useState } from 'react'
import Link from 'next/link'

type Good = {
  id: number
  gdName: string
  gdDescription: string
  picture: string | null
  retailPrice: any // Decimal (RMB)
  actualPrice: any // Decimal (USD)
  inStock: number
  type: number
  groupId: number
  group: {
    id: number
    gpName: string
  }
}

type Group = {
  id: number
  gpName: string
}

export default function ProductList({ goods, groups, dict }: { goods: Good[], groups: Group[], dict: any }) {
  const [activeGroup, setActiveGroup] = useState<number | 'all'>('all')
  const [search, setSearch] = useState('')

  const filteredGoods = goods.filter(g => {
    const matchesGroup = activeGroup === 'all' || g.groupId === activeGroup
    const matchesSearch = g.gdName.toLowerCase().includes(search.toLowerCase()) || 
                          g.gdDescription?.toLowerCase().includes(search.toLowerCase())
    return matchesGroup && matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Search and Tabs */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
        {/* Search */}
        <div className="relative group">
          <input
            type="text"
            placeholder={dict.search_placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-5 py-3 rounded-lg focus:outline-none focus:border-sl-blue focus:ring-1 focus:ring-sl-blue transition-all pl-12 placeholder-gray-400"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-sl-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveGroup('all')}
            className={`px-5 py-2 rounded-lg text-sm font-bold tracking-wide uppercase transition-all duration-300 border ${
              activeGroup === 'all'
                ? 'bg-sl-blue text-white border-sl-blue shadow-md'
                : 'bg-gray-100 border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
            }`}
          >
            {dict.all}
          </button>
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => setActiveGroup(group.id)}
              className={`px-5 py-2 rounded-lg text-sm font-bold tracking-wide uppercase transition-all duration-300 border ${
                activeGroup === group.id
                  ? 'bg-sl-blue text-white border-sl-blue shadow-md'
                  : 'bg-gray-100 border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
              }`}
            >
              {group.gpName}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGoods.length > 0 ? (
          filteredGoods.map((good) => (
            <div key={good.id} className="group bg-sl-card rounded-xl overflow-hidden border border-gray-100 hover:border-sl-blue/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
              <div className="relative aspect-video sm:aspect-auto sm:h-48 w-full overflow-hidden">
                {good.picture ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-40 z-10"></div>
                    <img src={good.picture} alt={good.gdName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
                     <span className="text-gray-300 font-mono text-xs tracking-widest uppercase">No Image</span>
                  </div>
                )}
                
                {/* Stock Badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider text-white z-20 ${
                  good.inStock > 0 ? 'bg-green-500 shadow-sm' : 'bg-red-500 shadow-sm'
                }`}>
                  {good.inStock > 0 ? dict.in_stock : dict.out_of_stock}
                </div>

                {/* Type Badge */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold bg-white/90 backdrop-blur-sm text-gray-900 border border-gray-200 z-20">
                  {good.type === 1 ? 'AUTO' : 'MANUAL'}
                </div>
              </div>

              <div className="p-5 relative flex-1 flex flex-col">
                <div className="text-[10px] text-sl-blue font-bold uppercase tracking-widest mb-2 opacity-80">
                  [{good.group.gpName}]
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-sl-blue transition-colors flex-1" title={good.gdName}>
                  {good.gdName}
                </h2>
                
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-50">
                  <div className="flex flex-col">
                     <span className="text-xs text-gray-400 mb-1 font-mono uppercase tracking-tighter">Price</span>
                     <span className="text-xl font-black text-gray-900 group-hover:text-sl-blue transition-colors">
                       ¥{Number(good.retailPrice).toFixed(2)}
                     </span>
                  </div>
                  <Link 
                    href={`/goods/${good.id}`}
                    className="relative overflow-hidden bg-gray-900 text-white px-4 py-2 sm:px-6 rounded font-bold text-xs sm:text-sm uppercase tracking-wide hover:bg-sl-blue transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    <span className="relative z-10">{dict.buy}</span>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white/50 rounded-xl border border-gray-200 border-dashed">
            <p className="text-gray-400 font-mono text-lg">{dict.no_products}</p>
          </div>
        )}
      </div>
    </div>
  )
}
