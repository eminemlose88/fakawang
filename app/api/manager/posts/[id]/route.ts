import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const id = parseInt(params.id)
    const body = await req.json()

    // Check if slug exists (if changed)
    if (body.slug) {
        const existing = await prisma.post.findUnique({
            where: { slug: body.slug }
        })
        if (existing && existing.id !== id) {
             return NextResponse.json({ error: 'Slug 已存在' }, { status: 400 })
        }
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        author: body.author,
        tags: body.tags,
        published: body.published,
        updatedAt: new Date() // Force update timestamp
      }
    })
    return NextResponse.json(post)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const id = parseInt(params.id)
    await prisma.post.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
  ) {
    const params = await props.params;
    try {
      const id = parseInt(params.id)
      const post = await prisma.post.findUnique({
        where: { id }
      })
      if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      return NextResponse.json(post)
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 })
    }
  }
