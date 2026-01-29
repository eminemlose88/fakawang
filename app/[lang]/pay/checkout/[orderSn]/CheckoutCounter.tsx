'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Check, AlertCircle, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CheckoutCounterProps {
  order: any
  expirationTime: number
  dict: any
  lang: string
}

export default function CheckoutCounter({ order, expirationTime, dict, lang }: CheckoutCounterProps) {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(0)
  const [status, setStatus] = useState(order.status)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [copiedAmount, setCopiedAmount] = useState(false)

  useEffect(() => {
    // Initial timer calculation
    const updateTimer = () => {
      const now = Date.now()
      const diff = Math.max(0, Math.floor((expirationTime - now) / 1000))
      setTimeLeft(diff)
    }
    
    updateTimer()
    const timerInterval = setInterval(updateTimer, 1000)

    // Poll for status
    const statusInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/pay/check-status?orderSn=${order.orderSn}`)
        if (res.ok) {
          const data = await res.json()
          if (data.status !== status) {
            setStatus(data.status)
            if (data.status === 2) { // Paid
                clearInterval(statusInterval)
                clearInterval(timerInterval)
                // Redirect to success page or order search
                router.push(`/${lang}/order-search?q=${order.orderSn}`)
            } else if (data.status === 3 || data.status === 4) { // Cancelled or Timeout
                clearInterval(statusInterval)
                clearInterval(timerInterval)
            }
          }
        }
      } catch (e) {
        console.error('Failed to check status', e)
      }
    }, 3000)

    return () => {
      clearInterval(timerInterval)
      clearInterval(statusInterval)
    }
  }, [expirationTime, order.orderSn, status, lang, router])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`
  }

  const copyToClipboard = (text: string, isAddress: boolean) => {
    navigator.clipboard.writeText(text)
    if (isAddress) {
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    } else {
      setCopiedAmount(true)
      setTimeout(() => setCopiedAmount(false), 2000)
    }
  }

  if (status === 2) {
    return (
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-green-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">支付成功</h2>
            <p className="text-gray-500">正在跳转...</p>
        </div>
    )
  }

  if (status === 3 || status === 4 || timeLeft === 0) {
    return (
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">订单已失效</h2>
            <p className="text-gray-500 mb-6">订单已取消或支付超时</p>
            <button 
                onClick={() => router.push(`/${lang}`)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
            >
                返回首页
            </button>
        </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full border border-gray-100">
      {/* Header */}
      <div className="bg-gray-50 p-6 border-b border-gray-100 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
             {/* USDT Icon Placeholder */}
             <span className="text-green-600 font-bold">₮</span>
        </div>
        <h1 className="text-lg font-bold text-gray-800">USDT 收银台</h1>
        <p className="text-sm text-gray-500 mt-1">订单号: {order.orderSn}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Amount */}
        <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">待支付金额 (USDT-TRC20)</p>
            <div 
                className="flex items-center justify-center gap-2 cursor-pointer group"
                onClick={() => copyToClipboard(Number(order.actualPaymentAmount).toFixed(2), false)}
            >
                <span className="text-3xl font-bold text-blue-600">{Number(order.actualPaymentAmount).toFixed(2)}</span>
                {copiedAmount ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-400 group-hover:text-blue-500" />}
            </div>
            <p className="text-xs text-red-500 mt-2 font-medium bg-red-50 py-1 px-2 rounded inline-block">
                ! 请务必支付上述确切金额，否则无法自动到账 !
            </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
            <div className="p-2 border-2 border-blue-100 rounded-xl">
                <QRCodeSVG value={order.paymentAddress} size={180} />
            </div>
        </div>

        {/* Address */}
        <div>
            <p className="text-sm text-gray-500 mb-2 text-center">收款地址 (点击复制)</p>
            <div 
                onClick={() => copyToClipboard(order.paymentAddress, true)}
                className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center justify-between gap-3 cursor-pointer hover:border-blue-300 transition-colors group"
            >
                <span className="text-xs font-mono text-gray-600 break-all">{order.paymentAddress}</span>
                {copiedAddress ? <Check size={16} className="text-green-500 shrink-0" /> : <Copy size={16} className="text-gray-400 group-hover:text-blue-500 shrink-0" />}
            </div>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center gap-2 text-gray-600 bg-gray-50 py-2 rounded-lg">
            <Clock size={18} />
            <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>
      
      <div className="px-6 pb-6 text-center">
          <p className="text-xs text-gray-400">支付完成后系统将自动跳转，请勿关闭页面</p>
      </div>
    </div>
  )
}