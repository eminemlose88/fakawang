import Link from 'next/link'
import prisma from '@/lib/prisma'
import { 
  Users, 
  ShoppingBag, 
  CreditCard, 
  DollarSign,
  Settings,
  Shield
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [
    todayOrders,
    totalIncome,
    goodsCount,
    lowStockGoods
  ] = await Promise.all([
    prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    }),
    prisma.order.aggregate({
      where: { status: 4 }, // Completed
      _sum: { actualPrice: true }
    }),
    prisma.goods.count(),
    prisma.goods.count({
      where: { inStock: { lt: 10 } }
    })
  ])

  const stats = [
    {
      title: '今日订单',
      value: todayOrders,
      icon: <ShoppingBag className="text-sl-blue" size={24} />,
      bg: 'bg-sl-blue/10'
    },
    {
      title: '总收入',
      value: `$${Number(totalIncome._sum.actualPrice || 0).toFixed(2)}`,
      icon: <DollarSign className="text-green-500" size={24} />,
      bg: 'bg-green-500/10'
    },
    {
      title: '商品总数',
      value: goodsCount,
      icon: <Package className="text-sl-purple" size={24} />,
      bg: 'bg-sl-purple/10'
    },
    {
      title: '库存预警',
      value: lowStockGoods,
      icon: <AlertCircle className="text-red-500" size={24} />,
      bg: 'bg-red-500/10'
    }
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-white">仪表盘</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-sl-card p-6 rounded-xl border border-white/5 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-full ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 text-white">快捷操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/manager/settings" className="bg-sl-card p-6 rounded-xl border border-white/5 shadow-sm hover:border-sl-blue/30 transition-all flex items-center gap-4 group">
            <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <Shield size={24} />
            </div>
            <div>
              <p className="font-medium text-white">账号安全</p>
              <p className="text-sm text-gray-400">修改密码与管理员资料</p>
            </div>
          </Link>

          <Link href="/manager/goods" className="bg-sl-card p-6 rounded-xl border border-white/5 shadow-sm hover:border-sl-blue/30 transition-all flex items-center gap-4 group">
            <div className="p-3 rounded-full bg-sl-blue/10 text-sl-blue group-hover:bg-sl-blue group-hover:text-black transition-colors">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="font-medium text-white">商品管理</p>
              <p className="text-sm text-gray-400">添加或编辑商品</p>
            </div>
          </Link>

          <Link href="/manager/settings" className="bg-sl-card p-6 rounded-xl border border-white/5 shadow-sm hover:border-sl-blue/30 transition-all flex items-center gap-4 group">
            <div className="p-3 rounded-full bg-white/10 text-gray-400 group-hover:bg-white group-hover:text-black transition-colors">
              <Settings size={24} />
            </div>
            <div>
              <p className="font-medium text-white">系统设置</p>
              <p className="text-sm text-gray-400">配置网站基本信息</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Placeholder for Chart */}
      <div className="bg-sl-card p-6 rounded-xl border border-white/5 shadow-sm h-96 flex items-center justify-center text-gray-500">
        收入图表 (即将推出)
      </div>
    </div>
  )
}

import { Package, AlertCircle } from 'lucide-react'
