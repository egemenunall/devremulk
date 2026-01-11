import { cookies } from 'next/headers';

const ADMIN_SESSION_COOKIE = 'admin-session';

// Admin oturumunu kontrol et
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);
  return session?.value === 'authenticated';
}

// Admin şifresini kontrol et
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'devremulk2026';
  return password === adminPassword;
}

// Admin oturum cookie adı
export { ADMIN_SESSION_COOKIE };
