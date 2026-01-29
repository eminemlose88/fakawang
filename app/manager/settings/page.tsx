'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Settings() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // System Settings State
  const [form, setForm] = useState({
    title: '',
    notice: '',
    footer: '',
    logo: ''
  })

  // Profile Settings State
  const [profileForm, setProfileForm] = useState({
    username: ''
  })

  // Password Settings State
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    // Fetch system settings
    fetch('/api/manager/settings')
      .then(res => res.json())
      .then(data => {
        setForm({
          title: data.title || '',
          notice: data.notice || '',
          footer: data.footer || '',
          logo: data.logo || ''
        })
      })

    // Fetch profile settings
    fetch('/api/manager/profile')
      .then(res => res.json())
      .then(data => {
        if (data.username) {
          setProfileForm({ username: data.username })
        }
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch('/api/manager/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      alert('系统设置已保存！')
    } catch (e) {
      alert('保存失败')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/manager/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      alert('账号信息已更新！')
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('两次输入的密码不一致！')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/manager/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
      })

      if (!res.ok) {
        // Try to parse error message, but handle non-JSON responses
        let errorMessage = '修改失败'
        try {
            const data = await res.json()
            errorMessage = data.error || errorMessage
        } catch (e) {
            console.error('Failed to parse error response:', e)
        }
        throw new Error(errorMessage)
      }

      const data = await res.json()

      alert('密码修改成功！')
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <h1 className="text-3xl font-bold text-white">系统设置 & 管理</h1>

      {/* System Settings */}
      <section className="bg-sl-card shadow-md rounded-lg p-6 border border-white/5">
        <h2 className="text-xl font-bold mb-6 text-white border-b border-white/5 pb-2">网站基础设置</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-sl-text-muted">网站标题</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              className="mt-1 block w-full rounded-md border-white/10 bg-black/50 text-white shadow-sm focus:border-sl-blue focus:ring-sl-blue border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sl-text-muted">Logo URL</label>
            <input
              type="text"
              value={form.logo}
              onChange={e => setForm({...form, logo: e.target.value})}
              className="mt-1 block w-full rounded-md border-white/10 bg-black/50 text-white shadow-sm focus:border-sl-blue focus:ring-sl-blue border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sl-text-muted">公告 (HTML)</label>
            <textarea
              rows={5}
              value={form.notice}
              onChange={e => setForm({...form, notice: e.target.value})}
              className="mt-1 block w-full rounded-md border-white/10 bg-black/50 text-white shadow-sm focus:border-sl-blue focus:ring-sl-blue border p-2 font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-sl-text-muted">页脚文本</label>
            <input
              type="text"
              value={form.footer}
              onChange={e => setForm({...form, footer: e.target.value})}
              className="mt-1 block w-full rounded-md border-white/10 bg-black/50 text-white shadow-sm focus:border-sl-blue focus:ring-sl-blue border p-2"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-sl-blue text-black font-bold px-6 py-2 rounded-md hover:bg-sl-blue/80 disabled:opacity-50 transition-colors"
            >
              {loading ? '保存中...' : '保存系统设置'}
            </button>
          </div>
        </form>
      </section>

      {/* Profile Settings */}
      <section className="bg-sl-card shadow-md rounded-lg p-6 border border-white/5">
        <h2 className="text-xl font-bold mb-6 text-white border-b border-white/5 pb-2">管理员账号设置</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-sl-text-muted">用户名</label>
            <input
              type="text"
              required
              minLength={3}
              value={profileForm.username}
              onChange={e => setProfileForm({...profileForm, username: e.target.value})}
              className="mt-1 block w-full rounded-md border-white/10 bg-black/50 text-white shadow-sm focus:border-sl-blue focus:ring-sl-blue border p-2"
            />
            <p className="mt-1 text-sm text-gray-500">修改用户名后，您的登录状态将自动更新。</p>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '处理中...' : '更新账号信息'}
            </button>
          </div>
        </form>
      </section>

      {/* Password Settings */}
      <section className="bg-sl-card shadow-md rounded-lg p-6 border border-white/5">
        <h2 className="text-xl font-bold mb-6 text-white border-b border-white/5 pb-2">安全设置 (修改密码)</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-sl-text-muted">当前密码</label>
            <input
              type="password"
              required
              value={passwordForm.oldPassword}
              onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
              className="mt-1 block w-full rounded-md border-white/10 bg-black/50 text-white shadow-sm focus:border-sl-blue focus:ring-sl-blue border p-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-sl-text-muted">新密码</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                className="mt-1 block w-full rounded-md border-white/10 bg-black/50 text-white shadow-sm focus:border-sl-blue focus:ring-sl-blue border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sl-text-muted">确认新密码</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                className="mt-1 block w-full rounded-md border-white/10 bg-black/50 text-white shadow-sm focus:border-sl-blue focus:ring-sl-blue border p-2"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '处理中...' : '修改密码'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
