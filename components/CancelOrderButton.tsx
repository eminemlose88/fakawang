'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CancelOrderButton({ orderSn, email }: { orderSn: string, email?: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    if (!confirm('确定要取消此订单吗？取消后卡密将释放，需重新购买。')) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/order/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderSn, email })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || '取消失败')
      }

      alert('订单已取消')
      router.refresh()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm disabled:opacity-50"
    >
      {loading ? '处理中...' : '取消订单'}
    </button>
  )
}
