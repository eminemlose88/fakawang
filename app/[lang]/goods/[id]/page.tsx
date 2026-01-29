import prisma from '@/lib/prisma'
import BuyForm from './BuyForm'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

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
  
  const good = await prisma.goods.findUnique({
    where: { id },
    include: { group: true }
  })

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
    <div className="min-h-screen bg-sl-dark p-8 pt-24">
      <div className="max-w-4xl mx-auto bg-sl-card rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 p-6 bg-black/30 relative">
          {good.picture ? (
            <div className="relative rounded-lg overflow-hidden shadow-lg border border-white/5 group">
               <div className="absolute inset-0 bg-gradient-to-t from-sl-card/80 to-transparent z-10"></div>
               <img src={good.picture} alt={good.gdName} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ) : (
            <div className="w-full h-64 bg-black/50 rounded-lg flex items-center justify-center border border-white/5 relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
               <span className="text-gray-600 font-mono tracking-widest text-sm">NO SIGNAL</span>
            </div>
          )}
          <div className="mt-8">
            <h3 className="text-sm font-bold text-sl-blue uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-sl-blue rounded-full"></span>
              商品详情
            </h3>
            <div className="mt-2 text-gray-300 prose prose-invert prose-sm max-w-none font-mono text-sm leading-relaxed bg-black/20 p-4 rounded border border-white/5">
              {good.description || good.gdDescription}
            </div>
          </div>
        </div>

        <div className="md:w-1/2 p-8 bg-sl-card relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sl-blue/5 rounded-full blur-3xl -z-0"></div>
          
          <div className="mb-8 relative z-10">
            <span className="inline-block bg-sl-blue/10 text-sl-blue border border-sl-blue/30 text-[10px] font-bold px-3 py-1 rounded mb-3 uppercase tracking-widest">
              [{good.group.gpName}]
            </span>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">{good.gdName}</h1>
            <p className="text-gray-500 text-xs font-mono uppercase tracking-wide">
              类型: <span className="text-gray-300">{good.type === 1 ? '自动发货' : '人工处理'}</span>
            </p>
          </div>

          <div className="relative z-10">
             <BuyForm good={serializedGood} pays={serializedPays} />
          </div>
        </div>
      </div>
    </div>
  )
}
