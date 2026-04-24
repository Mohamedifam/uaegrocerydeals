import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const ads = await prisma.ad.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(ads);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ad = await prisma.ad.create({
      data: {
        title: body.title,
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl,
        active: body.active ?? true,
        order: body.order ?? 0
      }
    });
    return NextResponse.json(ad);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create ad' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const ad = await prisma.ad.update({
      where: { id: body.id },
      data: {
        title: body.title,
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl,
        active: body.active,
        order: body.order
      }
    });
    return NextResponse.json(ad);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update ad' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.ad.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete ad' }, { status: 500 });
  }
}
