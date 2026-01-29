import prisma from '@/lib/prisma'

export async function getSystemSettings() {
  const settings = await prisma.systemSetting.findMany()
  return settings.reduce((acc, curr) => {
    acc[curr.slug] = curr.value
    return acc
  }, {} as Record<string, string | null>)
}
