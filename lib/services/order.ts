import prisma from '@/lib/prisma'

export class OrderService {
  /**
   * Process automatic delivery for an order
   */
  static async processAutoDelivery(orderId: number) {
    // 1. Get Order with Goods info
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { goods: true }
    })

    if (!order) throw new Error('Order not found')
    if (order.status === 4) return // Already completed

    // 2. Check if goods is auto-delivery type
    if (order.goods.type !== 1) {
      // Manual processing, just update status to pending
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 2 } // Pending
      })
      return
    }

    // 3. Find locked carmis for this order
    // New Logic: Find carmis that were locked for this order
    let carmis = await prisma.carmi.findMany({
      where: {
        goodsId: order.goodsId,
        orderId: order.id,
        status: 3 // Locked
      }
    })

    // Fallback logic for old orders or if locking failed but stock was available?
    // If no locked carmis found, try to find unsold ones (Not recommended for strict locking, but keeps backward compatibility if needed)
    // For strict locking as requested: if not found, it's an error.
    
    if (carmis.length < order.buyAmount) {
      // Insufficient stock, mark as Abnormal
      // Note: With locking logic, this means lock failed or data inconsistency
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 6 } // Abnormal
      })
      return
    }

    // 4. Assign carmis to order
    const carmiContent = carmis.map(c => c.carmi).join('\n')
    const carmiIds = carmis.map(c => c.id)

    await prisma.$transaction([
      // Update carmis status to SOLD
      prisma.carmi.updateMany({
        where: { id: { in: carmiIds } },
        data: { status: 2 } // Sold
      }),
      // Note: We already decremented stock at order creation (locking phase)
      // So we don't decrement here anymore.
      
      // Update order status and info
      prisma.order.update({
        where: { id: orderId },
        data: {
          status: 4, // Completed
          info: carmiContent
        }
      })
    ])

    return true
  }

  /**
   * Cancel expired orders and release stock
   * Timeout: 5 minutes
   */
  static async cancelExpiredOrders() {
      const timeoutMinutes = 5
      const expirationTime = new Date(Date.now() - timeoutMinutes * 60 * 1000)

      // Find expired orders (Status 1: Wait Pay)
      const expiredOrders = await prisma.order.findMany({
          where: {
              status: 1,
              createdAt: { lt: expirationTime }
          },
          include: { goods: true }
      })

      console.log(`[Cron] Found ${expiredOrders.length} expired orders.`)

      let processedCount = 0

      for (const order of expiredOrders) {
          try {
              await prisma.$transaction(async (tx) => {
                  // Double check status
                  const currentOrder = await tx.order.findUnique({ where: { id: order.id } })
                  if (!currentOrder || currentOrder.status !== 1) return

                  // 1. Update order status to Expired (5)
                  // Note: You might need to add status 5 to your enum/logic if not exists, assume 5 is Expired
                  // If schema comment says: // 1: wait pay, 2: pending, 3: processing, 4: completed
                  // We can use 5 for Expired/Cancelled
                  await tx.order.update({
                      where: { id: order.id },
                      data: { status: 5 } 
                  })

                  // 2. If auto-delivery (type 1), release locked carmis and stock
                  if (order.goods.type === 1) {
                      // Release carmis: status 3 -> 1, orderId -> null
                      const updateResult = await tx.carmi.updateMany({
                          where: { 
                              orderId: order.id,
                              status: 3 
                          },
                          data: {
                              status: 1,
                              orderId: null
                          }
                      })

                      // Restore stock
                      if (updateResult.count > 0) {
                          await tx.goods.update({
                              where: { id: order.goodsId },
                              data: { inStock: { increment: updateResult.count } }
                          })
                      }
                  }
              })
              processedCount++
          } catch (e) {
              console.error(`[Cron] Failed to cancel order ${order.orderSn}:`, e)
          }
      }

      return { processed: processedCount }
  }
}
