import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    const id = parseInt(params.id)
    const body = await req.json()
    const group = await prisma.goodsGroup.update({
      where: { id },
      data: {
        gpName: body.gpName,
        isOpen: body.isOpen,
        ord: body.ord
      }
    })
    return NextResponse.json(group)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    const id = parseInt(params.id)
    await prisma.goodsGroup.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
