'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash, List } from 'lucide-react'

export default function GoodsList() {
  const [goods, setGoods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/manager/goods')
      .then(res => res.json())
      .then(data => {
        setGoods(data)
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return
    await fetch(`/api/manager/goods/${id}`, { method: 'DELETE' })
    setGoods(goods.filter(g => g.id !== id))
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">商品管理</h1>
        <div className="flex gap-3">
          <Link 
            href="/manager/groups"
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            <List size={20} />
            分组管理
          </Link>
          <Link 
            href="/manager/goods/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            添加商品
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">名称</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">分组</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">展示价格 (RMB)</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">结算价格 (USD)</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">库存</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">状态</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {goods.length === 0 ? (
                <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                        暂无商品，请点击右上角添加。
                    </td>
                </tr>
            ) : goods.map(good => (
              <tr key={good.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{good.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {good.picture && (
                      <img className="h-10 w-10 rounded-full mr-3 object-cover" src={good.picture} alt="" />
                    )}
                    <div className="text-sm font-semibold text-gray-900">{good.gdName}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{good.group?.gpName || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">¥{Number(good.retailPrice).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">${Number(good.actualPrice).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {good.type === 1 ? (
                      <span className={`font-medium ${good.inStock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                          {good.inStock}
                      </span>
                  ) : '人工'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    good.isOpen === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {good.isOpen === 1 ? '已上架' : '已下架'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/manager/goods/${good.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                    <Edit size={18} />
                  </Link>
                  <button onClick={() => handleDelete(good.id)} className="text-red-600 hover:text-red-900">
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
