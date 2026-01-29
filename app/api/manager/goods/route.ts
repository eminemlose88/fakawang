import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const goods = await prisma.goods.findMany({
    include: { group: true },
    orderBy: { ord: 'desc' }
  })
  return NextResponse.json(goods)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const goods = await prisma.goods.create({
      data: {
        gdName: body.gdName,
        gdDescription: body.gdDescription,
        gdKeywords: body.gdKeywords || '',
        picture: body.picture,
        retailPrice: body.retailPrice,
        actualPrice: body.actualPrice,
        type: body.type,
        isOpen: body.isOpen,
        groupId: Number(body.groupId),
        ord: body.ord || 1
      }
    })
    return NextResponse.json(goods)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
