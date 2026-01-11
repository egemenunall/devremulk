import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/utils/auth';

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: 'Çıkış başarılı' },
    { status: 200 }
  );

  // Session cookie'yi sil
  response.cookies.delete(ADMIN_SESSION_COOKIE);

  return response;
}
