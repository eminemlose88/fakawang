'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash, X } from 'lucide-react'

type Group = {
  id: number
  gpName: string
  isOpen: number
  ord: number
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  
  // Form states
  const [formData, setFormData] = useState({
    gpName: '',
    isOpen: 1,
    ord: 1
  })

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/manager/groups')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setGroups(data)
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingGroup 
        ? `/api/manager/groups/${editingGroup.id}`
        : '/api/manager/groups'
        
      const method = editingGroup ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Operation failed')
      
      closeModal()
      fetchGroups()
    } catch (error) {
      console.error('Error saving group:', error)
      alert('保存失败，请重试')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个分类吗？')) return
    
    try {
      const res = await fetch(`/api/manager/groups/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      fetchGroups()
    } catch (error) {
      console.error('Error deleting group:', error)
      alert('删除失败，请重试')
    }
  }

  const openAddModal = () => {
    setEditingGroup(null)
    setFormData({ gpName: '', isOpen: 1, ord: 1 })
    setIsModalOpen(true)
  }

  const openEditModal = (group: Group) => {
    setEditingGroup(group)
    setFormData({
      gpName: group.gpName,
      isOpen: group.isOpen,
      ord: group.ord
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingGroup(null)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">分类管理</h1>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          添加分类
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">分类名称</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">排序</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">状态</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groups.length === 0 ? (
                <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                        暂无分类，请点击右上角添加。
                    </td>
                </tr>
            ) : groups.map(group => (
              <tr key={group.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.gpName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.ord}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    group.isOpen === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {group.isOpen === 1 ? '启用' : '禁用'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openEditModal(group)} className="text-blue-600 hover:text-blue-900 mr-4">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(group.id)} className="text-red-600 hover:text-red-900">
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingGroup ? '编辑分类' : '添加分类'}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类名称</label>
                <input
                  type="text"
                  required
                  value={formData.gpName}
                  onChange={e => setFormData({...formData, gpName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入分类名称"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序 (越大越靠前)</label>
                <input
                  type="number"
                  value={formData.ord}
                  onChange={e => setFormData({...formData, ord: parseInt(e.target.value) || 0})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  value={formData.isOpen}
                  onChange={e => setFormData({...formData, isOpen: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>启用</option>
                  <option value={0}>禁用</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
