import crypto from 'crypto'

export interface CryptomusPaymentData {
  amount: string
  currency: string
  order_id: string
  url_return?: string
  url_callback?: string
  is_payment_multiple?: boolean
  lifetime?: number
  to_currency?: string
}

export class CryptomusService {
  private merchantId: string
  private apiKey: string
  private apiUrl = 'https://api.cryptomus.com/v1/payment'

  constructor(merchantId: string, apiKey: string) {
    this.merchantId = merchantId
    this.apiKey = apiKey
  }

  /**
   * Create a payment invoice
   */
  async createPayment(data: CryptomusPaymentData) {
    const payload = JSON.stringify(data)
    const sign = crypto
      .createHash('md5')
      .update(Buffer.from(payload).toString('base64') + this.apiKey)
      .digest('hex')

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'merchant': this.merchantId,
        'sign': sign,
        'Content-Type': 'application/json'
      },
      body: payload
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create payment')
    }

    return result
  }

  /**
   * Verify webhook signature
   */
  static verifySignature(body: any, apiKey: string, receivedSign: string): boolean {
    const payload = JSON.stringify(body)
    const expectedSign = crypto
      .createHash('md5')
      .update(Buffer.from(payload).toString('base64') + apiKey)
      .digest('hex')

    return expectedSign === receivedSign
  }
}
