import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    console.log('Upload request received');
    const data = await request.formData();
    console.log('Form data parsed');
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      console.log('No file in form data');
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    console.log(`Uploading file: ${file.name}, size: ${file.size}`);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    console.log(`Upload directory: ${uploadsDir}`);
    
    if (!fs.existsSync(uploadsDir)) {
      console.log('Creating uploads directory');
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const fileName = `${Date.now()}-${safeFileName}`;
    const path = join(uploadsDir, fileName);
    console.log(`Saving to path: ${path}`);
    
    await writeFile(path, buffer);
    console.log('File saved successfully');

    return NextResponse.json({ success: true, url: `/uploads/${fileName}` }, { status: 201 });
  } catch (error) {
    console.error('CRITICAL: Error uploading file:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
