'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/manager/posts')
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这篇文章吗？')) return

    try {
      const res = await fetch(`/api/manager/posts/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        fetchPosts()
      } else {
        alert('删除失败')
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('删除失败')
    }
  }

  const togglePublish = async (post: any) => {
    try {
      const res = await fetch(`/api/manager/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published })
      })
      if (res.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Failed to update post:', error)
    }
  }

  if (loading) return <div>加载中...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">文章管理</h1>
        <Link 
          href="/manager/posts/edit"
          className="bg-sl-blue text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-sl-blue/80 transition-colors"
        >
          <Plus size={20} />
          <span>新建文章</span>
        </Link>
      </div>

      <div className="bg-sl-card rounded-xl border border-white/5 shadow-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">标题</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">URL 标识 (Slug)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">浏览量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">创建时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{post.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {post.slug}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => togglePublish(post)}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${
                      post.published 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : 'bg-white/10 text-gray-400 border-white/10'
                    }`}
                  >
                    {post.published ? (
                        <>
                            <Eye size={12} /> 已发布
                        </>
                    ) : (
                        <>
                            <EyeOff size={12} /> 草稿
                        </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {post.views}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/manager/posts/edit?id=${post.id}`}
                      className="text-sl-blue hover:text-white transition-colors"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
