import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const groups = await prisma.goodsGroup.findMany({
    orderBy: { ord: 'desc' }
  })
  return NextResponse.json(groups)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const group = await prisma.goodsGroup.create({
      data: {
        gpName: body.gpName,
        isOpen: body.isOpen,
        ord: body.ord
      }
    })
    return NextResponse.json(group)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
