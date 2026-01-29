import { getDictionary } from '@/lib/dictionary'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import CheckoutCounter from './CheckoutCounter'

interface PageProps {
  params: Promise<{
    lang: string
    orderSn: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { lang, orderSn } = await params
  const dict = await getDictionary(lang)

  const order = await prisma.order.findUnique({
    where: { orderSn },
    include: {
        pay: true
    }
  })

  if (!order || !order.paymentAddress) {
    notFound()
  }

  // Calculate expiration time (e.g. 15 minutes from created_at)
  // Or check if Epusdt returned an expiration time (we didn't save it, so assume 15 mins)
  const expirationTime = new Date(order.createdAt).getTime() + 15 * 60 * 1000

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <CheckoutCounter 
        order={order} 
        expirationTime={expirationTime}
        dict={dict}
        lang={lang}
      />
    </div>
  )
}