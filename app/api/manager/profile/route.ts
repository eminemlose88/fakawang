import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession, login } from '@/lib/auth/session'

export async function GET() {
  const session = await getSession()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: session.user.id },
    select: { username: true, name: true }
  })

  return NextResponse.json(user)
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { username } = await req.json()

    if (!username || username.trim().length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 })
    }

    // Check if username already exists (and not the current user)
    const existing = await prisma.adminUser.findUnique({
      where: { username }
    })

    if (existing && existing.id !== session.user.id) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
    }

    // Update user
    const updatedUser = await prisma.adminUser.update({
      where: { id: session.user.id },
      data: { username },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true
      }
    })

    // Refresh session with new user data
    await login(updatedUser)

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
