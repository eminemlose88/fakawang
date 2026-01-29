import prisma from '@/lib/prisma'
import BuyForm from './BuyForm'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getSystemSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const id = parseInt(params.id)
  const good = await prisma.goods.findUnique({
    where: { id }
  })

  if (!good) return {}

  return {
    title: good.gdName,
    description: good.gdDescription || `Buy ${good.gdName} instantly. Best price and secure delivery.`,
    keywords: good.gdKeywords ? good.gdKeywords.split(',') : [good.gdName, 'digital goods', 'buy online'],
    openGraph: {
      title: good.gdName,
      description: good.gdDescription || `Buy ${good.gdName} instantly.`,
      images: good.picture ? [good.picture] : [],
    }
  }
}

export default async function GoodsDetail(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = parseInt(params.id)
  
  const [good, settings] = await Promise.all([
    prisma.goods.findUnique({
      where: { id },
      include: { group: true }
    }),
    getSystemSettings()
  ])

  if (!good || good.isOpen !== 1) {
    notFound()
  }

  const pays = await prisma.pay.findMany({
    where: { isOpen: 1 }
  })

  const serializedGood = {
    ...good,
    retailPrice: Number(good.retailPrice),
    actualPrice: Number(good.actualPrice),
    createdAt: good.createdAt.toISOString(),
    updatedAt: good.updatedAt.toISOString(),
    group: {
      ...good.group,
      createdAt: good.group.createdAt.toISOString(),
      updatedAt: good.group.updatedAt.toISOString(),
    }
  }

  const serializedPays = pays.map(pay => ({
    ...pay,
    createdAt: pay.createdAt.toISOString(),
    updatedAt: pay.updatedAt.toISOString(),
  }))

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pt-20 md:pt-28">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* System Notification in Detail Page */}
        {settings.notice && (
          <div className="max-w-full mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-sl-blue/20 rounded-lg p-4 relative overflow-hidden group hover:border-sl-blue/40 transition-colors shadow-sm">
              <div className="absolute top-0 left-0 w-1 h-full bg-sl-blue"></div>
              <h2 className="text-sl-blue font-bold tracking-widest text-[10px] uppercase mb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-sl-blue rounded-full animate-pulse"></span>
                SYSTEM NOTIFICATION
              </h2>
              <div 
                className="text-gray-600 text-xs md:text-sm leading-relaxed font-mono"
                dangerouslySetInnerHTML={{ __html: settings.notice }} 
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          {/* Left Side: Image and Description (Smaller ratio: 1/3) */}
          <div className="md:w-[35%] p-6 bg-gray-50/50 relative border-b md:border-b-0 md:border-r border-gray-100">
            {good.picture ? (
              <div className="relative rounded-lg overflow-hidden shadow-sm border border-gray-200 group bg-white">
                 <img src={good.picture} alt={good.gdName} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
                 <span className="text-gray-400 font-mono tracking-widest text-xs uppercase">No Image</span>
              </div>
            )}
            <div className="mt-8">
              <h3 className="text-xs font-bold text-sl-blue uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-sl-blue rounded-full"></span>
                商品详情
              </h3>
              <div className="mt-2 text-gray-700 prose prose-slate prose-sm max-w-none font-mono text-sm leading-relaxed bg-white p-4 rounded border border-gray-100">
                {good.description || good.gdDescription}
              </div>
            </div>
          </div>

          {/* Right Side: Form and Purchase (Larger ratio: 2/3) */}
          <div className="md:w-[65%] p-8 bg-white relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-sl-blue/5 rounded-full blur-3xl -z-0"></div>
            
            <div className="mb-8 relative z-10">
              <span className="inline-block bg-sl-blue/5 text-sl-blue border border-sl-blue/20 text-[10px] font-bold px-3 py-1 rounded mb-3 uppercase tracking-widest">
                [{good.group.gpName}]
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">{good.gdName}</h1>
              <p className="text-gray-400 text-[10px] font-mono uppercase tracking-wide">
                类型: <span className="text-gray-600 font-bold">{good.type === 1 ? '自动发货' : '人工处理'}</span>
              </p>
            </div>

            <div className="relative z-10">
               <BuyForm good={serializedGood} pays={serializedPays} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
