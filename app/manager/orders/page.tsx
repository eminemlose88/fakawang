'use client'

import { useState, useEffect } from 'react'

export default function OrdersList() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/manager/orders')
      .then(res => res.json())
      .then(setOrders)
  }, [])

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1: return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">待支付</span>
      case 2: return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">处理中</span>
      case 3: return <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">进行中</span>
      case 4: return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">已完成</span>
      case 5: return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">失败</span>
      case 6: return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">异常</span>
      case -1: return <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs">已取消</span>
      default: return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">未知 ({status})</span>
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">订单管理</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">支付方式</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderSn}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.buyAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${Number(order.actualPrice).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.pay?.payName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
