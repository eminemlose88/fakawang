'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'

export default function GoodsForm(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter()
  const isNew = params.id === 'new'
  const [loading, setLoading] = useState(false)
  const [groups, setGroups] = useState<any[]>([])
  
  const [form, setForm] = useState({
    gdName: '',
    gdDescription: '',
    gdKeywords: '',
    picture: '',
    retailPrice: '0',
    actualPrice: '0',
    type: 1,
    isOpen: 1,
    groupId: 0,
    ord: 1
  })

  useEffect(() => {
    // Load groups
    fetch('/api/manager/groups')
      .then(res => res.json())
      .then(data => {
        setGroups(data)
        // If creating new and groups exist, default to first group
        if (isNew && data.length > 0) {
          setForm(prev => ({ ...prev, groupId: data[0].id }))
        }
      })

    if (!isNew) {
      fetch(`/api/manager/goods/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          gdName: data.gdName,
          gdDescription: data.gdDescription || '',
          gdKeywords: data.gdKeywords || '',
          picture: data.picture || '',
          retailPrice: String(data.retailPrice),
          actualPrice: String(data.actualPrice),
          type: data.type,
          isOpen: data.isOpen,
          groupId: data.groupId,
          ord: data.ord
        })
      })
    }
  }, [isNew, params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate groupId
    if (!form.groupId) {
        alert('请先创建商品分组！')
        setLoading(false)
        return
    }

    const url = isNew ? '/api/manager/goods' : `/api/manager/goods/${params.id}`
    const method = isNew ? 'POST' : 'PUT'

    // Convert string prices to numbers for API
    const submitData = {
      ...form,
      retailPrice: Number(form.retailPrice),
      actualPrice: Number(form.actualPrice)
    }

    try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.error || '保存失败')
        }

        router.push('/manager/goods')
        router.refresh() // Force refresh to show new data
    } catch (e: any) {
        alert(e.message)
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{isNew ? '添加商品' : '编辑商品'}</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6 border border-gray-100">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">商品名称</label>
          <input
            type="text"
            required
            placeholder="请输入商品名称"
            value={form.gdName}
            onChange={e => setForm({...form, gdName: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5 bg-gray-50 text-gray-900"
          />
        </div>

        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">商品分组</label>
            {groups.length === 0 ? (
                <div className="text-red-500 text-sm">
                    暂无分组，请先在数据库或通过脚本添加分组。
                </div>
            ) : (
                <select
                    value={form.groupId}
                    onChange={e => setForm({...form, groupId: Number(e.target.value)})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5 bg-gray-50 text-gray-900"
                >
                    {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.gpName}</option>
                    ))}
                </select>
            )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">描述</label>
          <textarea
            rows={3}
            value={form.gdDescription}
            onChange={e => setForm({...form, gdDescription: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5 bg-gray-50 text-gray-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">原价</label>
            <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={form.retailPrice}
                  onChange={e => setForm({...form, retailPrice: e.target.value})}
                  className="block w-full rounded-md border-gray-300 pl-7 focus:border-blue-500 focus:ring-blue-500 border p-2.5 bg-gray-50 text-gray-900"
                />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">实际价格</label>
            <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.actualPrice}
                  onChange={e => setForm({...form, actualPrice: e.target.value})}
                  className="block w-full rounded-md border-gray-300 pl-7 focus:border-blue-500 focus:ring-blue-500 border p-2.5 bg-gray-50 text-gray-900"
                />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">发货类型</label>
            <select
              value={form.type}
              onChange={e => setForm({...form, type: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5 bg-gray-50 text-gray-900"
            >
              <option value={1}>自动发货</option>
              <option value={2}>手工处理</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">状态</label>
            <select
              value={form.isOpen}
              onChange={e => setForm({...form, isOpen: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5 bg-gray-50 text-gray-900"
            >
              <option value={1}>上架</option>
              <option value={0}>下架</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">图片 URL</label>
          <input
            type="text"
            value={form.picture}
            onChange={e => setForm({...form, picture: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5 bg-gray-50 text-gray-900"
          />
        </div>

        <div className="flex justify-end pt-4 border-t mt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="mr-4 px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium shadow-sm"
          >
            {loading ? '保存中...' : '保存商品'}
          </button>
        </div>
      </form>
    </div>
  )
}
