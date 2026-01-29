import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Basic validation
    if (!body.title || !body.slug || !body.content) {
        return NextResponse.json({ error: '标题、Slug 和内容不能为空' }, { status: 400 })
    }

    // Check if slug exists
    const existing = await prisma.post.findUnique({
      where: { slug: body.slug }
    })
    
    if (existing) {
      return NextResponse.json({ error: 'Slug 已存在，请使用其他 URL 标识' }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        author: body.author || 'Admin',
        tags: body.tags,
        published: body.published ?? true
      }
    })
    
    return NextResponse.json(post)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
