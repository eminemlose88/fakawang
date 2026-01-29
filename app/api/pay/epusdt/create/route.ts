import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { EpusdtService } from '@/lib/pay/epusdt'

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

    // pay.merchantId stores API URL
    // pay.merchantKey stores API Token
    if (!order.pay || !order.pay.merchantId || !order.pay.merchantKey) {
      return NextResponse.json({ error: 'Payment method not configured' }, { status: 400 })
    }

    // 2. Initialize Epusdt Service
    const epusdt = new EpusdtService(order.pay.merchantId, order.pay.merchantKey)

    // 3. Create Transaction
    const host = req.headers.get('host')
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    const baseUrl = `${protocol}://${host}`

    // Ensure amount is a number
    const amount = Number(order.actualPrice)

    let result;
    try {
        result = await epusdt.createTransaction({
            amount: amount,
            order_id: order.orderSn,
            redirect_url: `${baseUrl}/order-search?q=${order.orderSn}`,
            notify_url: `${baseUrl}/api/pay/epusdt/notify`,
        })
    } catch (e: any) {
        // Handle "Order already exists" error
        // Epusdt might return various error messages, so we check for common keywords
        const errorMsg = e.message || '';
        if (errorMsg.includes('订单已存在') || errorMsg.includes('exists') || errorMsg.includes('重复')) {
             console.log('Order already exists, constructing payment URL manually')
             
             // Option A: If we saved tradeNo in database, use it.
             if (order.tradeNo) {
                 // Use local checkout page
                 const paymentUrl = `${baseUrl}/pay/checkout/${order.orderSn}`
                 return NextResponse.json({ url: paymentUrl })
             }
             
             throw new Error('订单已存在，请到订单查询页面查看或重新下单。')
        }
        throw e
    }

    // 4. Update Order with Trade ID and Payment Info
    // Only update if we have a new trade_id
    if (result && result.trade_id) {
        await prisma.order.update({
        where: { id: order.id },
        data: { 
            tradeNo: result.trade_id,
            paymentAddress: result.token,
            actualPaymentAmount: result.actual_amount
        }
        })
    }

    // Use our own checkout page instead of Epusdt's
    // Redirect to /pay/checkout/[orderSn]
    // Note: We use orderSn instead of tradeNo for the URL parameter
    return NextResponse.json({ url: `${baseUrl}/pay/checkout/${order.orderSn}` })

  } catch (error: any) {
    console.error('Epusdt Create Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
