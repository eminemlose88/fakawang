import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id)
  const good = await prisma.goods.findUnique({
    where: { id },
    include: { group: true }
  })
  return NextResponse.json(good)
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const id = Number(params.id)
    const body = await req.json()
    const good = await prisma.goods.update({
      where: { id },
      data: {
        gdName: body.gdName,
        gdDescription: body.gdDescription,
        gdKeywords: body.gdKeywords,
        picture: body.picture,
        retailPrice: body.retailPrice,
        actualPrice: body.actualPrice,
        type: body.type,
        isOpen: body.isOpen,
        groupId: Number(body.groupId),
        ord: body.ord
      }
    })
    return NextResponse.json(good)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = Number(params.id)
  
  // Use a transaction to delete related records first if necessary, 
  // or rely on Prisma cascade delete if configured (which it might not be in the schema above).
  // Looking at the schema:
  // carmis -> goods (relation)
  // orders -> goods (relation)
  
  // We should probably delete related carmis first to avoid foreign key constraints if cascade isn't set up in DB.
  // And check if orders exist? Usually we don't delete goods if there are orders, or we set deleted_at.
  // But here user wants to delete.
  
  try {
      // 1. Delete associated carmis first (both sold and unsold)
      await prisma.carmi.deleteMany({ where: { goodsId: id } })
      
      // 2. Delete associated orders
      // Since orders also reference goods, we must delete them or nullify the reference.
      // Assuming we want to force delete the good, we delete the orders too.
      await prisma.order.deleteMany({ where: { goodsId: id } })
      
      // 3. Delete the good
      await prisma.goods.delete({ where: { id } })
      
      return NextResponse.json({ success: true })
  } catch (e: any) {
      console.error("Delete error:", e)
      return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
