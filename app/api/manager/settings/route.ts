import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const settings = await prisma.systemSetting.findMany()
  const settingsMap = settings.reduce((acc: any, curr) => {
    acc[curr.slug] = curr.value
    return acc
  }, {})
  return NextResponse.json(settingsMap)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    for (const [slug, value] of Object.entries(body)) {
      await prisma.systemSetting.upsert({
        where: { slug },
        update: { value: value as string },
        create: { slug, value: value as string }
      })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
