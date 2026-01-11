import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, ADMIN_SESSION_COOKIE } from '@/utils/auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Şifre gereklidir' },
        { status: 400 }
      );
    }

    if (verifyAdminPassword(password)) {
      const response = NextResponse.json(
        { success: true, message: 'Giriş başarılı' },
        { status: 200 }
      );

      // Session cookie ayarla
      response.cookies.set(ADMIN_SESSION_COOKIE, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 saat
        path: '/',
      });

      return response;
    } else {
      return NextResponse.json(
        { error: 'Geçersiz şifre' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
