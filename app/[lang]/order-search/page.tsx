import prisma from '@/lib/prisma'
import Link from 'next/link'
import { getDictionary } from '@/lib/dictionary'
import OrderHistory from '@/components/OrderHistory'
import DownloadButton from '@/components/DownloadButton'
import CancelOrderButton from '@/components/CancelOrderButton' // Import the new client component

export const dynamic = 'force-dynamic'

export default async function OrderSearch(props: {
  params: Promise<{ lang: string }>,
  searchParams: Promise<{ q?: string }>
}) {
  const params = await props.params
  const { lang } = params
  const searchParams = await props.searchParams
  const query = searchParams.q
  const dict = await getDictionary(lang)
  
  let orders: any[] = []

  if (query) {
    orders = await prisma.order.findMany({
      where: {
        OR: [
          { orderSn: query },
          { email: query }
        ]
      },
      include: {
        goods: true,
        pay: true
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  const getStatusBadge = (status: number | string) => {
    // Convert string status to number if necessary, or handle both
    const statusMap: Record<string, number> = {
        'pending': 1,
        'processing': 2,
        'active': 3,
        'completed': 4,
        'failed': 5,
        'abnormal': 6,
        'cancelled': -1
    }

    const statusCode = typeof status === 'string' ? (statusMap[status.toLowerCase()] ?? status) : status

    switch (statusCode) {
      case 1: return <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">{(dict.order_search as any).status_pending || 'Pending'}</span>
      case 2: return <span className="bg-blue-500/20 text-blue-500 border border-blue-500/50 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Processing</span>
      case 3: return <span className="bg-indigo-500/20 text-indigo-500 border border-indigo-500/50 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Active</span>
      case 4: return <span className="bg-green-500/20 text-green-500 border border-green-500/50 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Completed</span>
      case 5: return <span className="bg-red-500/20 text-red-500 border border-red-500/50 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Failed</span>
      case 6: return <span className="bg-orange-500/20 text-orange-500 border border-orange-500/50 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Abnormal</span>
      case -1: return <span className="bg-gray-500/20 text-gray-500 border border-gray-500/50 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Cancelled</span>
      default: return <span className="bg-gray-500/20 text-gray-500 border border-gray-500/50 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Unknown ({status})</span>
    }
  }

  return (
    <div className="min-h-screen bg-sl-dark py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-black text-center text-white uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          {dict.order_search.title}
        </h1>
        
        {/* Recent History */}
        <div className="bg-sl-card rounded-xl border border-white/5 shadow-lg overflow-hidden">
          <OrderHistory dict={dict.order_search} />
        </div>

        {/* Search Form */}
        <form className="bg-sl-card shadow-lg rounded-xl p-6 border border-white/5">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder={dict.order_search.placeholder}
              required
              className="flex-1 bg-black/50 border border-white/10 text-white px-5 py-3 rounded-lg focus:outline-none focus:border-sl-blue focus:shadow-[0_0_10px_rgba(0,234,255,0.2)] transition-all placeholder-gray-500"
            />
            <button
              type="submit"
              className="bg-white text-black px-8 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-sl-blue transition-colors shadow-lg hover:shadow-[0_0_15px_rgba(0,234,255,0.5)]"
            >
              {dict.order_search.search_btn}
            </button>
          </div>
        </form>

        {/* Results */}
        {query && orders.length === 0 && (
          <div className="text-center text-gray-400 bg-sl-card p-8 rounded-xl border border-white/5 border-dashed">
            {dict.order_search.no_results} <span className="text-white font-bold">"{query}"</span>
          </div>
        )}

        <div className="space-y-6">
          {orders.map(order => (
             <div key={order.id} className="bg-sl-card shadow-lg rounded-xl overflow-hidden border border-white/5 hover:border-sl-blue/30 transition-colors">
                <div className="px-6 py-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-mono">Order SN</span>
                    <span className="ml-3 font-mono font-bold text-sl-blue tracking-wide">{order.orderSn}</span>
                  </div>
                  {getStatusBadge(order.status === 'cancelled' ? -1 : order.status)}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">{order.title}</h3>
                  <div className="grid grid-cols-2 gap-6 text-sm mb-6">
                    <div>
                      <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">{dict.order_search.quantity}</span>
                      <span className="text-white font-mono">{order.buyAmount}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">{dict.order_search.total_price}</span>
                      <span className="text-2xl font-black text-sl-blue glow-text">${Number(order.actualPrice).toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">{dict.order_search.date}</span>
                      <span className="text-gray-300 font-mono">{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">{dict.order_search.payment}</span>
                      <span className="text-gray-300">{order.pay?.payName || 'N/A'}</span>
                    </div>
                  </div>
                  
                  {order.status === 4 && order.info && (
                    <div className="mt-4 bg-sl-blue/5 border border-sl-blue/20 rounded-lg p-4">
                      <h4 className="text-xs font-bold text-sl-blue mb-3 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-sl-blue rounded-full animate-pulse"></span>
                        {dict.order_search.order_info}
                      </h4>
                      <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono mb-4 bg-black/50 p-3 rounded border border-white/5 overflow-x-auto">{order.info}</pre>
                      <DownloadButton content={order.info} filename={`order_${order.orderSn}.txt`} />
                    </div>
                  )}

                  {order.status === 1 && (
                     <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/5">
                       <CancelOrderButton 
                         orderSn={order.orderSn} 
                         email={query?.includes('@') ? query : order.email} 
                       />
                       <Link 
                         href={`/pay/${order.orderSn}`}
                         className="bg-sl-blue text-black px-6 py-2 rounded font-bold uppercase tracking-wide hover:bg-white transition-colors shadow-[0_0_15px_rgba(0,234,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                       >
                         {dict.order_search.pay_now}
                       </Link>
                     </div>
                  )}
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  )
}
