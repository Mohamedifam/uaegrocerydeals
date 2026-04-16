import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const offers = await prisma.weeklyOffer.findMany({
      where: {
        validTo: { gte: new Date() }
      },
      include: { store: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch weekly offers' }, { status: 500 });
  }
}
