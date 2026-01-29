import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { orderSn } = await req.json()
    if (!orderSn) return NextResponse.json({ error: 'Order SN required' }, { status: 400 })

    const order = await prisma.order.findUnique({
      where: { orderSn },
      include: {
        pay: {
          select: {
            payName: true,
            payCheck: true
          }
        },
        goods: {
          select: {
            retailPrice: true
          }
        }
      }
    })

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
}
