import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { OrderService } from '@/lib/services/order'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderSn } = body

    if (!orderSn) {
      return NextResponse.json({ error: 'Order SN required' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { orderSn }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.status !== 1) {
      return NextResponse.json({ message: 'Order already processed' })
    }

    // Process Auto Delivery
    await OrderService.processAutoDelivery(order.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
