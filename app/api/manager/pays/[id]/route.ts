import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const id = parseInt(params.id)
    const body = await req.json()

    const pay = await prisma.pay.update({
      where: { id },
      data: {
        payName: body.payName,
        payCheck: body.payCheck,
        payMethod: parseInt(body.payMethod),
        merchantId: body.merchantId,
        merchantKey: body.merchantKey,
        merchantPem: body.merchantPem,
        payHandleroute: body.payHandleroute,
        isOpen: parseInt(body.isOpen)
      }
    })
    return NextResponse.json(pay)
  } catch (e: any) {
    if (e.code === 'P2002') {
        return NextResponse.json({ error: 'Pay Check code already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const id = parseInt(params.id)
    await prisma.pay.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
