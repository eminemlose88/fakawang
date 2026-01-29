import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const orderSn = searchParams.get('orderSn')

    if (!orderSn) {
      return NextResponse.json({ error: 'Order SN required' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { orderSn },
      select: {
        status: true,
        orderSn: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      status: order.status, // 1: Pending, 2: Paid, 3: Cancelled
      orderSn: order.orderSn
    })

  } catch (error) {
    console.error('Check Status Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}