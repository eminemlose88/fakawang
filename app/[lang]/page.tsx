import prisma from '@/lib/prisma'
import { getSystemSettings } from '@/lib/settings'
import ProductList from '@/components/ProductList'
import { getDictionary } from '@/lib/dictionary'

export const dynamic = 'force-dynamic'

export default async function Home(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const [goods, groups, settings, dict] = await Promise.all([
    prisma.goods.findMany({
      where: { isOpen: 1 },
      include: { group: true },
      orderBy: { ord: 'desc' }
    }),
    prisma.goodsGroup.findMany({
      where: { isOpen: 1 },
      orderBy: { ord: 'desc' }
    }),
    getSystemSettings(),
    getDictionary(params.lang)
  ])

  const serializedGoods = goods.map(good => ({
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
  }))

  const serializedGroups = groups.map(group => ({
    ...group,
    createdAt: group.createdAt.toISOString(),
    updatedAt: group.updatedAt.toISOString(),
  }))

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Hero / Announcement Section */}
      <div className="relative bg-gray-50 overflow-hidden border-b border-gray-100">
        {/* Background Overlay simulating professional atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-80 z-0"></div>
        
        {/* Animated Particles or Grid could go here */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto py-20 md:py-32 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-gray-900 mb-6 uppercase break-words">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600">
              {settings.title || 'LEVEL UP'}
            </span>
          </h1>
          
          {settings.notice && (
            <div className="mt-8 max-w-3xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm border border-sl-blue/20 rounded-lg p-6 relative overflow-hidden group hover:border-sl-blue/40 transition-colors shadow-sm">
                <div className="absolute top-0 left-0 w-1 h-full bg-sl-blue"></div>
                <h2 className="text-sl-blue font-bold tracking-widest text-xs uppercase mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-sl-blue rounded-full animate-pulse"></span>
                  SYSTEM NOTIFICATION
                </h2>
                <div 
                  className="text-gray-700 text-sm md:text-base leading-relaxed font-mono"
                  dangerouslySetInnerHTML={{ __html: settings.notice }} 
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <ProductList 
          goods={serializedGoods} 
          groups={serializedGroups} 
          dict={dict.home} 
        />

        {/* SEO / Features Section */}
        <section className="mt-32 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">
              Why Choose <span className="text-sl-blue">Us</span>?
            </h2>
            <div className="h-1 w-20 bg-sl-blue mx-auto shadow-sm"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-sl-card p-8 rounded-xl border border-gray-100 shadow-sm hover:border-sl-blue/30 transition-colors group">
              <div className="w-12 h-12 bg-sl-blue/5 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-sl-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Instant Delivery</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get your digital goods immediately after payment. Our automated system ensures 24/7 delivery of AWS accounts, Google Cloud, and more without any delay.
              </p>
            </div>

            <div className="bg-sl-card p-8 rounded-xl border border-gray-100 shadow-sm hover:border-sl-purple/30 transition-colors group">
              <div className="w-12 h-12 bg-sl-purple/5 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-sl-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Secure & Verified</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Every account is manually verified before listing. We provide high-quality, stable accounts with warranty to ensure your business continuity and security.
              </p>
            </div>

            <div className="bg-sl-card p-8 rounded-xl border border-gray-100 shadow-sm hover:border-green-500/30 transition-colors group">
              <div className="w-12 h-12 bg-green-500/5 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Crypto Payments</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We accept USDT (TRC20/ERC20) and other cryptocurrencies via secure gateways like Epusdt and Cryptomus. Privacy-focused and hassle-free transactions.
              </p>
            </div>
          </div>

          <div className="mt-20 bg-gray-50 p-8 rounded-xl border border-gray-100 text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">About Our Premium Digital Goods</h3>
            <div className="prose prose-slate max-w-none text-gray-600 text-sm">
              <p>
                Welcome to the premier destination for high-quality cloud accounts and digital assets. Whether you are looking to <strong>buy AWS accounts</strong>, <strong>Google Cloud Platform (GCP) accounts</strong>, or other virtual services, we have you covered. Our platform specializes in providing verified, ready-to-use accounts that help developers, startups, and businesses scale their infrastructure without the administrative hurdles.
              </p>
              <p className="mt-4">
                We understand the importance of stability and reliability in the digital space. That's why we offer a comprehensive warranty on all our products. From <strong>Azure accounts</strong> to <strong>DigitalOcean droplets</strong>, our inventory is constantly updated to meet market demands. Join thousands of satisfied customers who trust us for their cloud infrastructure needs.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
