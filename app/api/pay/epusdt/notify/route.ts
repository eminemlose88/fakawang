import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { EpusdtService } from '@/lib/pay/epusdt'
import { OrderService } from '@/lib/services/order'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { order_id, status, trade_id, signature } = body

    if (!order_id || !signature) {
      return new NextResponse('fail', { status: 400 })
    }

    // 1. Get Order
    const order = await prisma.order.findUnique({
      where: { orderSn: order_id },
      include: { pay: true }
    })

    if (!order) {
      return new NextResponse('fail', { status: 404 })
    }

    // 2. Verify Signature
    if (!order.pay || !order.pay.merchantKey || !order.pay.merchantId) {
      return new NextResponse('fail', { status: 500 })
    }

    const epusdt = new EpusdtService(order.pay.merchantId, order.pay.merchantKey)
    const isValid = epusdt.verifySignature(body)

    if (!isValid) {
      console.error('Epusdt Signature Invalid:', body)
      return new NextResponse('fail', { status: 400 })
    }

    // 3. Process Payment
    // status 2 means success
    if (status === 2) {
      if (order.status === 1) { // Only process if Wait Pay
        await OrderService.processAutoDelivery(order.id)
        
        // Update tradeNo
        if (!order.tradeNo && trade_id) {
            await prisma.order.update({
                where: { id: order.id },
                data: { tradeNo: trade_id }
            })
        }
      }
    }

    // Must return 'ok' string
    return new NextResponse('ok', { status: 200 })

  } catch (error: any) {
    console.error('Epusdt Webhook Error:', error)
    return new NextResponse('fail', { status: 500 })
  }
}
