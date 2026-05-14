import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-this');

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check for lockout
    if (admin.lockUntil && admin.lockUntil > new Date()) {
      const remainingMinutes = Math.ceil((admin.lockUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json({ 
        error: `Account locked due to too many failed attempts. Try again in ${remainingMinutes} minutes.` 
      }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      // Increment failed attempts
      const newAttempts = admin.failedAttempts + 1;
      let lockUntil = null;
      
      if (newAttempts >= 5) {
        lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 mins
      }

      await prisma.admin.update({
        where: { id: admin.id },
        data: { 
          failedAttempts: newAttempts,
          lockUntil
        }
      });

      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Success - reset attempts
    await prisma.admin.update({
      where: { id: admin.id },
      data: { 
        failedAttempts: 0,
        lockUntil: null
      }
    });

    // Create JWT session
    const token = await new SignJWT({ adminId: admin.id, username: admin.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(SECRET);

    const cookieStore = await cookies();
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7200 // 2 hours
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
