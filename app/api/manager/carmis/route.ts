import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const goodsId = searchParams.get('goodsId')
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 20

  const where: any = {}
  if (goodsId) where.goodsId = parseInt(goodsId)
  if (status) where.status = parseInt(status)

  try {
    const [total, carmis] = await prisma.$transaction([
      prisma.carmi.count({ where }),
      prisma.carmi.findMany({
        where,
        include: {
          goods: {
            select: { gdName: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize
      })
    ])

    return NextResponse.json({
      data: carmis,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { goodsId, content, isOpen = 1 } = body // content can be multiline

    if (!goodsId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const lines = content.split('\n').filter((line: string) => line.trim())
    const carmisData = lines.map((line: string) => ({
      goodsId: parseInt(goodsId),
      carmi: line.trim(),
      status: 1 // Default unsold
    }))

    // Use createMany
    const result = await prisma.carmi.createMany({
      data: carmisData
    })
    
    // Update stock
    await prisma.goods.update({
        where: { id: parseInt(goodsId) },
        data: { inStock: { increment: result.count } }
    })

    return NextResponse.json({ success: true, count: result.count })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
