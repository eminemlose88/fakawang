import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const post = await prisma.post.findUnique({
    where: { 
        slug: params.slug,
        published: true
    }
  })

  if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }
  
  // Increment view count
  await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
  })

  return NextResponse.json(post)
}
