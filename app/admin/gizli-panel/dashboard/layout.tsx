import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/utils/auth';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    redirect('/admin/gizli-panel');
  }

  return <>{children}</>;
}
