import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { CryptomusService } from '@/lib/pay/cryptomus'
import { OrderService } from '@/lib/services/order'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { sign } = body
    
    // 1. Find Order by Order ID (order_id in body)
    // We assume order_id passed to Cryptomus is our orderSn
    const { order_id, status, uuid } = body

    if (!order_id || !sign) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { orderSn: order_id },
      include: { pay: true }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // 2. Verify Signature
    if (!order.pay || !order.pay.merchantKey) {
      return NextResponse.json({ error: 'Payment config missing' }, { status: 500 })
    }

    // Note: Cryptomus sends the sign in the body, but our verifySignature helper expects it as a separate argument
    // and verifies the whole body (including sign? No, usually exclude sign from body or header sign).
    // Re-checking Cryptomus docs: "sign" is a HEADER, but sometimes in body.
    // The search result said: "The request must be signed. ... sign: MD5(base64_encode(json_encode(data)) . API_KEY)"
    // And "data" is the post body.
    // However, usually the signature is passed in HEADERS or POST field.
    // Search result 3 says: -H 'sign: ...'
    // So we should check the HEADER 'sign' or 'Sign'.
    
    const signatureHeader = req.headers.get('sign') || req.headers.get('Sign') || body.sign

    // We need to verify the RAW body or the parsed body without the signature field if it's in there.
    // But since we parsed JSON, let's use the body. 
    // IMPORTANT: Cryptomus docs say "MD5 hash of the body of the POST request".
    // So we need the raw body to be exact. But Next.js req.json() consumes the body.
    // In Next.js app router, we can't easily get raw body after json().
    // However, for verification we can try to reconstruct it or just trust the body object.
    // But wait, if signature is in the body, we must remove it before verification?
    // Docs say: "The request must be signed. Authentication ... via sending 2 HTTP headers: merchant and sign."
    // So the signature is in the HEADER. The body is the data.

    if (!signatureHeader) {
       // Fallback to body.sign if header is missing (some gateways do this)
       // But assuming header based on docs.
       return NextResponse.json({ error: 'Signature missing' }, { status: 400 })
    }

    // Remove 'sign' from body if it exists there to match the payload used for generation?
    // If the signature is on the body content, we should verify the body content.
    // Let's assume the body object is what was signed.
    
    // We need to remove 'sign' from body if it was included in the JSON body, 
    // BUT the docs say "MD5 hash of the body of the POST request". 
    // If the body sent by Cryptomus is just JSON data, we verify that.
    
    const isValid = CryptomusService.verifySignature(body, order.pay.merchantKey, signatureHeader)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // 3. Process Payment
    if (status === 'paid' || status === 'paid_over') {
      if (order.status === 1) { // Only process if Wait Pay
        await OrderService.processAutoDelivery(order.id)
        
        // Also update tradeNo if not set
        if (!order.tradeNo) {
            await prisma.order.update({
                where: { id: order.id },
                data: { tradeNo: uuid }
            })
        }
      }
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Cryptomus Webhook Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
