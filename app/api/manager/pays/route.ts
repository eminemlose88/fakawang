import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const pays = await prisma.pay.findMany({
      orderBy: { id: 'desc' }
    })
    return NextResponse.json(pays)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Basic validation
    if (!body.payName || !body.payCheck) {
        return NextResponse.json({ error: 'Name and Check code are required' }, { status: 400 })
    }

    const pay = await prisma.pay.create({
      data: {
        payName: body.payName,
        payCheck: body.payCheck,
        payMethod: parseInt(body.payMethod || '1'),
        merchantId: body.merchantId,
        merchantKey: body.merchantKey,
        merchantPem: body.merchantPem,
        payHandleroute: body.payHandleroute || '/api/pay/test/notify', // Default handler
        isOpen: parseInt(body.isOpen || '1')
      }
    })
    
    return NextResponse.json(pay)
  } catch (e: any) {
    // Check for unique constraint violation
    if (e.code === 'P2002') {
        return NextResponse.json({ error: 'Pay Check code already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
