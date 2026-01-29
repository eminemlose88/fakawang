import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST() {
  try {
    // 1. 获取所有商品
    const allGoods = await prisma.goods.findMany({
      select: { id: true, gdName: true }
    })

    const results = []

    // 2. 遍历每个商品，重新计算库存
    for (const goods of allGoods) {
      // 计算该商品下状态为 1 (未售) 的卡密数量
      const actualStock = await prisma.carmi.count({
        where: {
          goodsId: goods.id,
          status: 1
        }
      })

      // 更新商品库存字段
      await prisma.goods.update({
        where: { id: goods.id },
        data: { inStock: actualStock }
      })

      results.push({
        goodsId: goods.id,
        name: goods.gdName,
        stock: actualStock
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: '库存已重新校准',
      details: results 
    })

  } catch (error: any) {
    console.error('Stock Fix Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
