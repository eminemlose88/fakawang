'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  CreditCard, 
  Settings, 
  LogOut,
  List,
  BookOpen
} from 'lucide-react'

export default function AdminSidebar() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/manager/logout', { method: 'POST' })
      router.push('/manager/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <aside className="w-64 bg-sl-card text-white min-h-screen p-4 border-r border-white/5">
      <div className="flex items-center gap-2 mb-8 px-2">
        <span className="text-xl font-bold text-sl-blue">后台管理</span>
      </div>

      <nav className="space-y-2">
        <Link 
          href="/manager" 
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
        >
          <LayoutDashboard size={20} />
          <span>仪表盘</span>
        </Link>
        
        <Link 
          href="/manager/goods" 
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
        >
          <ShoppingBag size={20} />
          <span>商品管理</span>
        </Link>

        <Link 
          href="/manager/groups" 
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
        >
          <List size={20} />
          <span>分类管理</span>
        </Link>

        <Link 
          href="/manager/carmis" 
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
        >
          <CreditCard size={20} />
          <span>卡密管理</span>
        </Link>

        <Link 
          href="/manager/pays" 
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
        >
          <CreditCard size={20} />
          <span>支付管理</span>
        </Link>

        <Link 
          href="/manager/orders" 
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
        >
          <List size={20} />
          <span>订单管理</span>
        </Link>

        <Link 
          href="/manager/posts" 
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
        >
          <BookOpen size={20} />
          <span>文章管理</span>
        </Link>

        <Link 
          href="/manager/settings" 
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
        >
          <Settings size={20} />
          <span>系统设置</span>
        </Link>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-white/5 text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span>退出登录</span>
        </button>
      </div>
    </aside>
  )
}
