'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOrderHistory } from '@/hooks/useOrderHistory'

export default function BuyForm({ good, pays }: { good: any, pays: any[] }) {
  const router = useRouter()
  const { addOrder } = useOrderHistory()
  const [amount, setAmount] = useState(1)
  const [email, setEmail] = useState('')
  const [payId, setPayId] = useState(pays[0]?.id || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          goodsId: good.id,
          amount,
          email,
          payId: Number(payId)
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '创建订单失败')
      }

      // Save to history
      addOrder(data.data.orderSn)

      // Redirect to payment
      if (data.data.payUrl) {
        router.push(data.data.payUrl)
      } else {
        alert('订单创建成功！订单号: ' + data.data.orderSn)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">电子邮箱</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded focus:outline-none focus:border-sl-blue focus:ring-1 focus:ring-sl-blue transition-all placeholder-gray-400"
          placeholder="请输入您的邮箱"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">购买数量</label>
        <input
          type="number"
          min="1"
          max={good.inStock}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded focus:outline-none focus:border-sl-blue focus:ring-1 focus:ring-sl-blue transition-all"
        />
        <p className="text-[10px] text-gray-400 mt-2 font-mono uppercase tracking-wide">
          库存: <span className={good.inStock > 0 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>{good.inStock}</span>
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">支付方式</label>
        <div className="relative">
          <select
            value={payId}
            onChange={(e) => setPayId(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded appearance-none focus:outline-none focus:border-sl-blue focus:ring-1 focus:ring-sl-blue transition-all cursor-pointer"
          >
            {pays.map((pay: any) => (
              <option key={pay.id} value={pay.id} className="bg-white text-gray-900">
                {pay.payName}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <div className="flex justify-between items-end mb-6">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">总金额</span>
          <span className="text-3xl font-black text-gray-900">¥{(Number(good.retailPrice) * amount).toFixed(2)}</span>
        </div>

        <button
          type="submit"
          disabled={loading || good.inStock <= 0}
          className="w-full py-4 px-6 bg-gray-900 text-white font-black uppercase tracking-widest rounded hover:bg-sl-blue transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '处理中...' : (good.inStock <= 0 ? '缺货' : '立即支付')}
        </button>
      </div>
    </form>
  )
}
