import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const prices = await prisma.price.findMany({
      include: {
        store: true,
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(prices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const price = await prisma.price.create({
      data: {
        productId: data.productId,
        storeId: data.storeId,
        location: data.location,
        price: parseFloat(data.price),
        validFrom: new Date(data.validFrom),
        validTo: new Date(data.validTo),
        pdfUrl: data.pdfUrl,
        active: data.active ?? true,
      }
    });
    return NextResponse.json(price, { status: 201 });
  } catch (error) {
    console.error('Error creating price:', error);
    return NextResponse.json({ error: 'Failed to create price' }, { status: 500 });
  }
}
