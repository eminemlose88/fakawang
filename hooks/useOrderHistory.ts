'use client'

import { useState, useEffect } from 'react'

type HistoryItem = {
  orderSn: string
  date: string
}

const STORAGE_KEY = 'fakawang_order_history'
const MAX_ITEMS = 10

export function useOrderHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setHistory(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse order history', e)
      }
    }
  }, [])

  const addOrder = (orderSn: string) => {
    setHistory(prev => {
      // Remove existing if present to move to top
      const filtered = prev.filter(item => item.orderSn !== orderSn)
      
      const newItem = {
        orderSn,
        date: new Date().toISOString()
      }
      
      const newHistory = [newItem, ...filtered].slice(0, MAX_ITEMS)
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
      return newHistory
    })
  }

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY)
    setHistory([])
  }

  return { history, addOrder, clearHistory }
}
