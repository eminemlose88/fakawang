'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash, CreditCard, X } from 'lucide-react'

type Pay = {
  id: number
  payName: string
  payCheck: string
  payMethod: number
  merchantId: string
  merchantKey: string
  merchantPem: string
  payHandleroute: string
  isOpen: number
}

export default function PaysPage() {
  const [pays, setPays] = useState<Pay[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPay, setEditingPay] = useState<Pay | null>(null)
  
  const initialForm = {
    payName: '',
    payCheck: '',
    payMethod: 1,
    merchantId: '',
    merchantKey: '',
    merchantPem: '',
    payHandleroute: '/api/pay/test/notify',
    isOpen: 1
  }
  
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    fetchPays()
  }, [])

  const fetchPays = async () => {
    try {
      const res = await fetch('/api/manager/pays')
      const data = await res.json()
      setPays(data)
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const url = editingPay ? `/api/manager/pays/${editingPay.id}` : '/api/manager/pays'
    const method = editingPay ? 'PUT' : 'POST'

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
        const data = await res.json()
        
        if (!res.ok) throw new Error(data.error)
        
        setIsModalOpen(false)
        setEditingPay(null)
        setForm(initialForm)
        fetchPays()
    } catch (error: any) {
        alert(error.message)
    }
  }

  const handleDelete = async (id: number) => {
      if (!confirm('确定要删除此支付方式吗？')) return
      
      try {
          await fetch(`/api/manager/pays/${id}`, { method: 'DELETE' })
          fetchPays()
      } catch (error) {
          console.error(error)
      }
  }

  const openEdit = (pay: Pay) => {
      setEditingPay(pay)
      setForm({
          payName: pay.payName,
          payCheck: pay.payCheck,
          payMethod: pay.payMethod,
          merchantId: pay.merchantId || '',
          merchantKey: pay.merchantKey || '',
          merchantPem: pay.merchantPem || '',
          payHandleroute: pay.payHandleroute,
          isOpen: pay.isOpen
      })
      setIsModalOpen(true)
  }

  const openCreate = () => {
      setEditingPay(null)
      setForm(initialForm)
      setIsModalOpen(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">支付管理</h1>
        <button 
          onClick={openCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          添加支付
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">名称</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">标识 (Check)</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">类型</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">状态</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
                 <tr><td colSpan={6} className="text-center py-10">Loading...</td></tr>
            ) : pays.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                        暂无支付方式，请添加。
                    </td>
                </tr>
            ) : pays.map(pay => (
              <tr key={pay.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pay.id}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 flex items-center gap-2">
                    <CreditCard size={16} className="text-gray-400"/>
                    {pay.payName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{pay.payCheck}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pay.payMethod === 1 ? '跳转' : '扫码'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    pay.isOpen === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {pay.isOpen === 1 ? '启用' : '禁用'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openEdit(pay)} className="text-blue-600 hover:text-blue-900 mr-4">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(pay.id)} className="text-red-600 hover:text-red-900">
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingPay ? '编辑支付' : '添加支付'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">支付名称</label>
                    <input
                      type="text"
                      required
                      placeholder="例如: 支付宝"
                      value={form.payName}
                      onChange={e => setForm({...form, payName: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">标识代码 (Check)</label>
                    <input
                      type="text"
                      required
                      placeholder="例如: alipay"
                      value={form.payCheck}
                      onChange={e => setForm({...form, payCheck: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-1">必须唯一，用于系统识别</p>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">支付方式</label>
                    <select
                      value={form.payMethod}
                      onChange={e => setForm({...form, payMethod: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    >
                        <option value={1}>跳转支付</option>
                        <option value={2}>扫码支付</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">状态</label>
                    <select
                      value={form.isOpen}
                      onChange={e => setForm({...form, isOpen: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    >
                        <option value={1}>启用</option>
                        <option value={0}>禁用</option>
                    </select>
                  </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">商户 ID (Merchant ID)</label>
                <input
                  type="text"
                  value={form.merchantId}
                  onChange={e => setForm({...form, merchantId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">商户密钥 (Secret Key)</label>
                <input
                  type="text"
                  value={form.merchantKey}
                  onChange={e => setForm({...form, merchantKey: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                />
              </div>

               <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">其他配置 (PEM/Token)</label>
                <textarea
                  rows={3}
                  value={form.merchantPem}
                  onChange={e => setForm({...form, merchantPem: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">处理路由 (Handler Route)</label>
                <input
                  type="text"
                  value={form.payHandleroute}
                  onChange={e => setForm({...form, payHandleroute: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                />
                 <p className="text-xs text-gray-500 mt-1">默认为 /api/pay/test/notify (测试用)</p>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
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
                  {editingPay ? '保存修改' : '创建支付'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
