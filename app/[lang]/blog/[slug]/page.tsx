import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { Metadata } from 'next'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Generate metadata for each post
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const post = await prisma.post.findUnique({
    where: { slug: params.slug }
  })
  
  if (!post) return {}

  return {
    title: `${post.title} - 技术专区`,
    description: post.excerpt,
    keywords: post.tags?.split(','),
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author],
      tags: post.tags?.split(','),
    }
  }
}

export default async function PostDetail(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await prisma.post.findUnique({
    where: { slug: params.slug }
  })

  if (!post) {
    notFound()
  }

  // Increment view count (server-side, non-blocking)
  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } }
  }).catch(console.error)

  return (
    <div className="min-h-screen bg-sl-dark py-20 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <div className="flex justify-center gap-2 mb-6">
            {post.tags?.split(',').map(tag => (
              <span key={tag} className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sl-blue/10 text-sl-blue border border-sl-blue/20">
                {tag.trim()}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm font-mono text-gray-400 uppercase tracking-wide">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>作者: {post.author}</span>
            <span>•</span>
            <span>阅读: {post.views}</span>
          </div>
        </header>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight prose-a:text-sl-blue prose-img:rounded-xl prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 text-center">
           <a href="/blog" className="inline-flex items-center gap-2 text-sl-blue hover:text-white transition-colors font-bold uppercase tracking-wider text-sm">
             &larr; 返回列表
           </a>
        </div>
      </article>
    </div>
  )
}
