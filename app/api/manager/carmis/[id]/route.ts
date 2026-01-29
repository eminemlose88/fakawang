import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const id = parseInt(params.id)
    
    // Check carmi status first
    const carmi = await prisma.carmi.findUnique({ where: { id } })
    if (!carmi) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // If unsold, decrease stock
    if (carmi.status === 1) {
        await prisma.goods.update({
            where: { id: carmi.goodsId },
            data: { inStock: { decrement: 1 } }
        })
    }

    await prisma.carmi.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
