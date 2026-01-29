import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

function generateOrderSn() {
  const now = new Date()
  return now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0') +
    Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { goodsId, amount, email, payId } = body

    if (!goodsId || !amount || !email || !payId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Use transaction to ensure stock check and locking are atomic-ish
    // Note: Prisma transaction does not lock rows for reading, so we still rely on optimistic check or careful flow
    const result = await prisma.$transaction(async (tx) => {
        const good = await tx.goods.findUnique({
            where: { id: goodsId }
        })

        if (!good) {
            throw new Error('Goods not found')
        }

        if (good.inStock < amount) {
            throw new Error('Insufficient stock')
        }
        
        // If auto-delivery, try to lock carmis
        if (good.type === 1) {
            const carmis = await tx.carmi.findMany({
                where: {
                    goodsId: goodsId,
                    status: 1 // Unsold
                },
                take: amount
            })
            
            if (carmis.length < amount) {
                throw new Error('Insufficient stock (Carmis)')
            }
            
            // Create Order
            const orderSn = generateOrderSn()
            const total = Number(good.actualPrice) * amount
            
            const order = await tx.order.create({
              data: {
                orderSn,
                goodsId,
                title: good.gdName,
                type: good.type,
                goodsPrice: good.actualPrice,
                buyAmount: amount,
                totalPrice: total,
                actualPrice: total,
                email,
                payId,
                buyIp: '127.0.0.1', 
                status: 1 // Wait Pay
              }
            })
            
            // Lock Carmis
            const carmiIds = carmis.map(c => c.id)
            await tx.carmi.updateMany({
                where: { id: { in: carmiIds } },
                data: { 
                    status: 3, // Locked
                    orderId: order.id 
                }
            })
            
            // Decrease Stock
            await tx.goods.update({
                where: { id: goodsId },
                data: { inStock: { decrement: amount } }
            })
            
            return order
        } else {
            // Manual delivery
            const orderSn = generateOrderSn()
            const total = Number(good.actualPrice) * amount
            
            const order = await tx.order.create({
              data: {
                orderSn,
                goodsId,
                title: good.gdName,
                type: good.type,
                goodsPrice: good.actualPrice,
                buyAmount: amount,
                totalPrice: total,
                actualPrice: total,
                email,
                payId,
                buyIp: '127.0.0.1',
                status: 1
              }
            })
            return order
        }
    })

    // Return redirect URL for payment
    return NextResponse.json({ 
      message: 'Order created',
      data: {
        ...result,
        payUrl: `/pay/${result.orderSn}`
      }
    })

  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message || 'Internal Error' }, { status: 500 })
  }
}
