'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash, Search, X } from 'lucide-react'

type Carmi = {
  id: number
  goodsId: number
  status: number
  carmi: string
  orderId: number | null
  createdAt: string
  goods?: {
    gdName: string
  }
}

type Goods = {
    id: number
    gdName: string
}

export default function CarmisPage() {
  const [carmis, setCarmis] = useState<Carmi[]>([])
  const [goodsList, setGoodsList] = useState<Goods[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    goodsId: '',
    status: '',
    page: 1
  })
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [importForm, setImportForm] = useState({
      goodsId: '',
      content: ''
  })

  useEffect(() => {
    // Load Goods for filter and add
    fetch('/api/manager/goods')
        .then(res => res.json())
        .then(data => setGoodsList(data))
  }, [])

  useEffect(() => {
    fetchCarmis()
  }, [filters])

  const fetchCarmis = async () => {
    setLoading(true)
    const query = new URLSearchParams()
    if (filters.goodsId) query.append('goodsId', filters.goodsId)
    if (filters.status) query.append('status', filters.status)
    query.append('page', filters.page.toString())

    try {
      const res = await fetch(`/api/manager/carmis?${query.toString()}`)
      const data = await res.json()
      setCarmis(data.data)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching carmis:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个卡密吗？')) return
    
    try {
      const res = await fetch(`/api/manager/carmis/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      fetchCarmis()
    } catch (error) {
      console.error('Error deleting carmi:', error)
      alert('删除失败')
    }
  }

  const handleImport = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!importForm.goodsId || !importForm.content) return

      try {
          const res = await fetch('/api/manager/carmis', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(importForm)
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error)
          
          alert(`成功导入 ${data.count} 个卡密`)
          setIsModalOpen(false)
          setImportForm({ goodsId: '', content: '' })
          fetchCarmis()
      } catch (error: any) {
          alert('导入失败: ' + error.message)
      }
  }

  const getStatusBadge = (status: number) => {
      switch(status) {
          case 1: return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">未售</span>
          case 2: return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">已售</span>
          case 3: return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">锁定</span>
          default: return <span>-</span>
      }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">卡密管理</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          导入卡密
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4">
          <select 
            className="border rounded-md px-3 py-2"
            value={filters.goodsId}
            onChange={e => setFilters({...filters, goodsId: e.target.value, page: 1})}
          >
              <option value="">所有商品</option>
              {goodsList.map(g => (
                  <option key={g.id} value={g.id}>{g.gdName}</option>
              ))}
          </select>

          <select 
            className="border rounded-md px-3 py-2"
            value={filters.status}
            onChange={e => setFilters({...filters, status: e.target.value, page: 1})}
          >
              <option value="">所有状态</option>
              <option value="1">未售</option>
              <option value="2">已售</option>
              <option value="3">锁定</option>
          </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">商品名称</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">卡密内容</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">状态</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">创建时间</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
                 <tr><td colSpan={6} className="text-center py-10">Loading...</td></tr>
            ) : carmis.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                        暂无数据
                    </td>
                </tr>
            ) : carmis.map(carmi => (
              <tr key={carmi.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{carmi.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{carmi.goods?.gdName || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{carmi.carmi}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(carmi.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(carmi.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(carmi.id)} className="text-red-600 hover:text-red-900">
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t flex justify-between items-center">
            <span className="text-sm text-gray-500">共 {total} 条记录</span>
            <div className="flex gap-2">
                <button 
                    disabled={filters.page <= 1}
                    onClick={() => setFilters({...filters, page: filters.page - 1})}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    上一页
                </button>
                <span className="px-3 py-1">{filters.page} / {totalPages}</span>
                <button 
                    disabled={filters.page >= totalPages}
                    onClick={() => setFilters({...filters, page: filters.page + 1})}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    下一页
                </button>
            </div>
        </div>
      </div>

      {/* Import Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">导入卡密</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleImport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">选择商品</label>
                <select
                  required
                  value={importForm.goodsId}
                  onChange={e => setImportForm({...importForm, goodsId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">请选择商品</option>
                    {goodsList.map(g => (
                        <option key={g.id} value={g.id}>{g.gdName}</option>
                    ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">卡密内容 (一行一个)</label>
                <textarea
                  required
                  rows={10}
                  value={importForm.content}
                  onChange={e => setImportForm({...importForm, content: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="卡密1&#10;卡密2&#10;卡密3..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  开始导入
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
