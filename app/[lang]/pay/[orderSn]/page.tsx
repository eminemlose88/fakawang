'use client'

import { useState, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Order {
  id: number
  orderSn: string
  title: string
  actualPrice: string
  pay: {
    payCheck: string
    payName: string
  }
}

export default function Cashier(props: { params: Promise<{ orderSn: string }> }) {
  const params = use(props.params);
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
        try {
            const infoRes = await fetch('/api/order/info', {
                method: 'POST',
                body: JSON.stringify({ orderSn: params.orderSn })
            })
            if (infoRes.ok) {
                const data = await infoRes.json()
                setOrder(data)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setFetching(false)
        }
    }
    fetchOrder()
  }, [params.orderSn])


  const handlePay = async () => {
    if (!order) return
    setLoading(true)
    
    try {
      if (order.pay.payCheck === 'cryptomus') {
        // Cryptomus Payment
        const res = await fetch('/api/pay/cryptomus/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderSn: params.orderSn })
        })
        const data = await res.json()
        if (res.ok && data.url) {
          window.location.href = data.url
        } else {
          alert(data.error || 'Payment creation failed')
        }
      } else if (order.pay.payCheck === 'epusdt') {
        // Epusdt Payment
        const res = await fetch('/api/pay/epusdt/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderSn: params.orderSn })
        })
        const data = await res.json()
        if (res.ok && data.url) {
          window.location.href = data.url
        } else {
          alert(data.error || 'Payment creation failed')
        }
      } else {
        // Default / Test Payment
        const res = await fetch('/api/pay/test/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderSn: params.orderSn })
        })

        if (res.ok) {
          alert('Payment Successful! Redirecting to Order Search...')
          router.push(`/order-search?q=${params.orderSn}`)
        } else {
          alert('Payment Simulation Failed')
        }
      }
    } catch (e) {
      alert('Error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="min-h-screen bg-sl-dark flex items-center justify-center text-white font-mono tracking-widest animate-pulse">LOADING SYSTEM...</div>

  return (
    <div className="min-h-screen bg-sl-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sl-blue/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-sl-card p-10 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/5 max-w-md w-full text-center relative z-10">
        <div className="mb-8">
          <div className="mx-auto h-20 w-20 bg-sl-blue/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,234,255,0.2)] border border-sl-blue/20">
            <svg className="h-10 w-10 text-sl-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">收银台</h2>
          <p className="text-gray-500 mt-2 font-mono text-xs uppercase tracking-widest">Order SN: <span className="text-sl-blue">{params.orderSn}</span></p>
        </div>

        {order && (
            <div className="bg-black/40 p-6 rounded-lg mb-8 text-left space-y-4 border border-white/5">
                <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">商品</span>
                    <span className="font-bold text-white text-right max-w-[60%] truncate">{order.title}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">金额</span>
                    <span className="font-black text-2xl text-sl-blue glow-text">${Number(order.actualPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">支付方式</span>
                    <span className="font-mono text-white bg-white/10 px-2 py-1 rounded text-xs">{order.pay?.payName || '未知'}</span>
                </div>
            </div>
        )}

        <button
          onClick={handlePay}
          disabled={loading}
          className={`w-full py-4 px-6 rounded-lg font-black uppercase tracking-widest text-white transition-all shadow-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none ${
            order?.pay.payCheck === 'cryptomus' 
                ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20' 
                : 'bg-green-600 hover:bg-green-500 shadow-green-500/20'
          }`}
        >
          {loading ? 'PROCESSING...' : (order?.pay.payCheck === 'cryptomus' || order?.pay.payCheck === 'epusdt' ? `立即支付 (${order?.pay.payName})` : '模拟支付成功')}
        </button>
      </div>
    </div>
  )
}
