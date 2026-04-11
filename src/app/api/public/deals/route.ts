import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const storeId = url.searchParams.get('storeId');
    const today = new Date();

    const prices = await prisma.price.findMany({
      where: {
        active: true,
        validFrom: { lte: today },
        validTo: { gte: today },
        ...(storeId ? { storeId } : {})
      },
      include: {
        store: true,
        product: true
      },
      orderBy: { price: 'asc' }
    });

    if (prices.length === 0) {
      return NextResponse.json([]);
    }

    // Mark the best deal (cheapest item per product)
    const bestDealsMap = new Map<string, number>();
    prices.forEach(p => {
      const existing = bestDealsMap.get(p.productId);
      if (existing === undefined || p.price < existing) {
        bestDealsMap.set(p.productId, p.price);
      }
    });

    const responseData = prices.map(p => ({
      ...p,
      isBestDeal: bestDealsMap.get(p.productId) === p.price
    }));

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}
