'use client'

import { useOrderHistory } from '@/hooks/useOrderHistory'
import Link from 'next/link'
import { useEffect } from 'react'

export default function OrderHistory({ dict }: { dict: any }) {
  const { history, clearHistory } = useOrderHistory()

  if (history.length === 0) return null

  return (
    <div className="bg-sl-card shadow-lg rounded-xl border border-white/5 p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">{dict.recent_orders}</h2>
        <button 
          onClick={clearHistory}
          className="text-xs font-bold text-gray-500 hover:text-red-500 uppercase tracking-widest transition-colors"
        >
          {dict.clear_history}
        </button>
      </div>
      <div className="space-y-3">
        {history.map(item => (
          <Link 
            key={item.orderSn}
            href={`?q=${item.orderSn}`}
            className="block p-4 rounded-lg bg-black/30 border border-white/5 hover:bg-sl-blue/10 hover:border-sl-blue/30 transition-all flex justify-between items-center group"
          >
            <span className="font-mono text-gray-300 group-hover:text-sl-blue group-hover:glow-text transition-colors">{item.orderSn}</span>
            <span className="text-xs text-gray-500 font-mono">
              {new Date(item.date).toLocaleDateString()}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
