import Link from 'next/link'
import { Metadata } from 'next'
import prisma from '@/lib/prisma'

export const metadata: Metadata = {
  title: '技术专区 - Fakawang 2.0',
  description: '关于云账号和数字商品的最新指南、教程和见解。',
}

export const dynamic = 'force-dynamic'

export default async function BlogList() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-sl-dark py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sl-blue to-sl-purple">
              技术专区
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm md:text-base">
            管理数字资产的专家见解、安全指南和教程。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <div className="bg-sl-card rounded-xl overflow-hidden border border-white/5 hover:border-sl-blue/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,234,255,0.15)] hover:-translate-y-2 h-full flex flex-col">
                <div className="h-48 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
                   <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-black text-white/5 uppercase tracking-widest group-hover:text-sl-blue/10 transition-colors">
                        BLOG
                      </span>
                   </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    {post.tags?.split(',').map(tag => (
                      <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-sl-blue border border-white/5">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                  
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-sl-blue transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-400 text-sm line-clamp-3 mb-6 font-mono flex-1">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500 font-mono uppercase tracking-wide border-t border-white/5 pt-4">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      阅读全文 &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
