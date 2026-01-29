import crypto from 'crypto'

export interface EpusdtPaymentData {
  order_id: string
  amount: number
  notify_url: string
  redirect_url?: string
}

export class EpusdtService {
  private apiUrl: string
  private apiToken: string

  constructor(apiUrl: string, apiToken: string) {
    this.apiUrl = apiUrl.replace(/\/$/, '') // remove trailing slash
    this.apiToken = apiToken
  }

  /**
   * 签名算法
   * 1. 排序
   * 2. 拼接 key=value
   * 3. 加盐
   * 4. MD5 加密
   * 5. 转小写
   */
  private sign(params: Record<string, any>): string {
    const keys = Object.keys(params).sort()
    const kvs: string[] = []
    for (const key of keys) {
      const val = params[key]
      // 排除空值和 signature 本身
      if (val === '' || val === null || val === undefined || key === 'signature') continue
      kvs.push(`${key}=${val}`)
    }
    const str = kvs.join('&') + this.apiToken
    return crypto.createHash('md5').update(str).digest('hex').toLowerCase()
  }

  /**
   * 创建交易
   */
  async createTransaction(data: EpusdtPaymentData) {
    const params = {
      ...data,
    }
    const signature = this.sign(params)
    const payload = { ...params, signature }

    try {
      const response = await fetch(`${this.apiUrl}/api/v1/order/create-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (result.status_code !== 200) {
        throw new Error(result.message || 'Failed to create epusdt transaction')
      }

      return result.data
    } catch (error) {
      console.error('Epusdt createTransaction error:', error)
      throw error
    }
  }

  /**
   * 验证回调签名
   */
  verifySignature(data: Record<string, any>): boolean {
    const signature = data.signature
    if (!signature) return false
    const calculated = this.sign(data)
    return calculated === signature
  }
}
