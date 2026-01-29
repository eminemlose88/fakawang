import { NextResponse } from 'next/server'
import { OrderService } from '@/lib/services/order'

export async function GET(req: Request) {
  try {
    const result = await OrderService.cancelExpiredOrders()
    return NextResponse.json({ success: true, ...result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
