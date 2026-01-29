import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const goods = await prisma.goods.findMany({
      where: {
        isOpen: 1
      },
      include: {
        group: true
      }
    })
    return NextResponse.json({ data: goods })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch goods' }, { status: 500 })
  }
}
