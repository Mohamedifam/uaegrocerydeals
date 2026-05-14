import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { del } from '@vercel/blob';
import { unlink } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const offers = await prisma.weeklyOffer.findMany({
      include: { store: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch weekly offers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const offer = await prisma.weeklyOffer.create({
      data: {
        title: data.title,
        storeId: data.storeId,
        validFrom: new Date(data.validFrom),
        validTo: new Date(data.validTo),
        pdfUrl: data.pdfUrl
      }
    });
    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Offer ID is required' }, { status: 400 });
    }

    // 1. Find the offer to get the PDF URL
    const offer = await prisma.weeklyOffer.findUnique({ where: { id } });
    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // 2. Delete the actual physical file
    if (offer.pdfUrl) {
      try {
        if (offer.pdfUrl.includes('vercel-storage.com')) {
          // Delete from Vercel Blob
          await del(offer.pdfUrl);
          console.log('Deleted from Vercel Blob:', offer.pdfUrl);
        } else if (offer.pdfUrl.startsWith('/uploads/')) {
          // Delete local file
          const fileName = offer.pdfUrl.replace('/uploads/', '');
          const filePath = join(process.cwd(), 'public', 'uploads', fileName);
          await unlink(filePath);
          console.log('Deleted local file:', filePath);
        }
      } catch (fileError) {
        console.error('Failed to delete physical file:', fileError);
        // We still want to delete the DB record even if the file is already gone
      }
    }

    // 3. Delete from DB
    await prisma.weeklyOffer.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting offer:', error);
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
  }
}
