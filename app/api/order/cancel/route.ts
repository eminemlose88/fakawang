import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { orderSn, email } = await req.json()

    if (!orderSn) {
      return NextResponse.json({ error: '订单号不能为空' }, { status: 400 })
    }

    // 1. 查询订单
    const order = await prisma.order.findUnique({
      where: { orderSn },
      include: { carmis: true }
    })

    if (!order) {
      return NextResponse.json({ error: '订单不存在' }, { status: 404 })
    }

    // 2. 验证权限 (如果是游客订单，通过 email/查询密码 验证)
    if (email && order.email !== email) {
      return NextResponse.json({ error: '无权操作此订单' }, { status: 403 })
    }

    // 3. 验证状态
    if (order.status !== 1) {
      return NextResponse.json({ error: '只有待支付的订单可以取消' }, { status: 400 })
    }

    // 4. 执行取消操作 (事务)
    await prisma.$transaction(async (tx) => {
      // 4.1 释放卡密
      await tx.carmi.updateMany({
        where: { orderId: order.id },
        data: {
          status: 1, // unsold
          orderId: null
        }
      })

      // 4.2 更新订单状态
      await tx.order.update({
        where: { id: order.id },
        data: { status: -1 } // cancelled
      })

      // 4.3 恢复商品库存
      // 假设订单创建时减少了库存，这里需要加回去
      await tx.goods.update({
        where: { id: order.goodsId },
        data: {
          inStock: { increment: order.buyAmount },
          salesVolume: { decrement: order.buyAmount }
        }
      })
    })

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Cancel Order Error:', error)
    return NextResponse.json({ error: '取消订单失败' }, { status: 500 })
  }
}
