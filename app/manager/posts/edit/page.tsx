'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function EditPostForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: '',
    author: 'Admin',
    published: true
  })

  useEffect(() => {
    if (id) {
      fetchPost(id)
    }
  }, [id])

  const fetchPost = async (postId: string) => {
    try {
      const res = await fetch(`/api/manager/posts/${postId}`)
      if (res.ok) {
        const data = await res.json()
        setFormData({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || '',
          content: data.content,
          tags: data.tags || '',
          author: data.author,
          published: data.published
        })
      } else {
        alert('加载文章失败')
        router.push('/manager/posts')
      }
    } catch (error) {
      console.error('Failed to fetch post:', error)
      alert('加载文章失败')
      router.push('/manager/posts')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = id ? `/api/manager/posts/${id}` : '/api/manager/posts'
      const method = id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        router.push('/manager/posts')
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || '保存失败')
      }
    } catch (error) {
      console.error('Failed to save post:', error)
      alert('保存失败')
    } finally {
      setLoading(false)
    }
  }

  // Auto-generate slug from title if empty
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: !id && !prev.slug ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : prev.slug
    }))
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/manager/posts" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-white">{id ? '编辑文章' : '新建文章'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-sl-card rounded-xl border border-white/5 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-xl">
            <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-sl-text-muted mb-1">标题</label>
                <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-blue text-white placeholder-gray-600"
                    placeholder="请输入文章标题"
                />
            </div>

            <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-sl-text-muted mb-1">Slug (URL 标识)</label>
                <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-blue text-white placeholder-gray-600"
                    placeholder="example-post-url"
                />
            </div>

            <div className="col-span-2">
                <label className="block text-sm font-medium text-sl-text-muted mb-1">摘要</label>
                <textarea
                    value={formData.excerpt}
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-blue text-white placeholder-gray-600"
                    placeholder="简短的描述，用于列表展示和 SEO"
                />
            </div>
            
            <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-sl-text-muted mb-1">标签 (逗号分隔)</label>
                <input
                    type="text"
                    value={formData.tags}
                    onChange={e => setFormData({...formData, tags: e.target.value})}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-blue text-white placeholder-gray-600"
                    placeholder="AWS, Cloud, Guide"
                />
            </div>

            <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-sl-text-muted mb-1">作者</label>
                <input
                    type="text"
                    value={formData.author}
                    onChange={e => setFormData({...formData, author: e.target.value})}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-blue text-white placeholder-gray-600"
                />
            </div>

            <div className="col-span-2 flex items-center gap-2">
                <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={e => setFormData({...formData, published: e.target.checked})}
                    className="w-4 h-4 text-sl-blue rounded border-white/10 bg-black/50 focus:ring-sl-blue focus:ring-offset-0"
                />
                <label htmlFor="published" className="text-sm font-medium text-sl-text-muted">立即发布</label>
            </div>
        </div>

        <div className="bg-sl-card rounded-xl border border-white/5 p-6 shadow-xl">
            <label className="block text-sm font-medium text-sl-text-muted mb-2">内容 (Markdown)</label>
            <div className="relative">
                <textarea
                    required
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    rows={20}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-sl-blue text-white placeholder-gray-600 font-mono text-sm"
                    placeholder="# Hello World"
                />
                <div className="absolute top-2 right-2 text-xs text-gray-500 pointer-events-none">
                    支持 Markdown 语法
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-4">
            <Link 
                href="/manager/posts"
                className="px-4 py-2 border border-white/10 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
            >
                取消
            </Link>
            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-sl-blue text-black font-bold rounded-lg hover:bg-sl-blue/80 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
                <Save size={18} />
                {loading ? '保存中...' : '保存文章'}
            </button>
        </div>
      </form>
    </div>
  )
}

export default function EditPostPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditPostForm />
        </Suspense>
    )
}
