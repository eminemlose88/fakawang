import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { CryptomusService } from '@/lib/pay/cryptomus'

export async function POST(req: Request) {
  try {
    const { orderSn } = await req.json()

    if (!orderSn) {
      return NextResponse.json({ error: 'Order SN required' }, { status: 400 })
    }

    // 1. Get Order and Payment Config
    const order = await prisma.order.findUnique({
      where: { orderSn },
      include: { pay: true }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (!order.pay || !order.pay.merchantId || !order.pay.merchantKey) {
      return NextResponse.json({ error: 'Payment method not configured' }, { status: 400 })
    }

    // 2. Initialize Cryptomus Service
    const cryptomus = new CryptomusService(order.pay.merchantId, order.pay.merchantKey)

    // 3. Create Invoice
    // Use the request host for callback URL
    const host = req.headers.get('host')
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    const baseUrl = `${protocol}://${host}`

    const result = await cryptomus.createPayment({
      amount: order.actualPrice.toString(),
      currency: 'USD', // Changed to USD
      order_id: order.orderSn,
      url_return: `${baseUrl}/order-search?q=${order.orderSn}`,
      url_callback: `${baseUrl}/api/pay/cryptomus/notify`,
      to_currency: 'USDT' // Default to USDT
    })

    // 4. Update Order with Trade No (UUID)
    await prisma.order.update({
      where: { id: order.id },
      data: { tradeNo: result.result.uuid }
    })

    return NextResponse.json({ url: result.result.url })

  } catch (error: any) {
    console.error('Cryptomus Create Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
