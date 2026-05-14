import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

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

    // Fallback to local storage if Vercel Blob token is missing
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.log('No BLOB_READ_WRITE_TOKEN found, saving file locally.');
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const filePath = join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      
      console.log(`File saved locally: /uploads/${fileName}`);
      return NextResponse.json({ 
        success: true, 
        url: `/uploads/${fileName}` 
      }, { status: 201 });
    }

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
    console.error('CRITICAL: Upload failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed',
      details: 'Ensure BLOB_READ_WRITE_TOKEN is set in your environment variables.'
    }, { status: 500 });
  }
}
