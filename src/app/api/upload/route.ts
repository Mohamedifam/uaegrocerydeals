import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const data = await request.formData();
    const file = data.get('file') as File | null;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No file uploaded or invalid format' }, { status: 400 });
    }

    // Standardize filename to avoid issues
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const fileName = `${Date.now()}-${safeFileName}`;

    // Upload directly to Vercel Blob
    const blob = await put(fileName, file, {
      access: 'public',
    });

    console.log(`File uploaded to Blob: ${blob.url}`);

    return NextResponse.json({ 
      success: true, 
      url: blob.url 
    }, { status: 201 });
  } catch (error) {
    console.error('CRITICAL: Vercel Blob upload failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed',
      details: 'Ensure BLOB_READ_WRITE_TOKEN is set in your environment variables.'
    }, { status: 500 });
  }
}
