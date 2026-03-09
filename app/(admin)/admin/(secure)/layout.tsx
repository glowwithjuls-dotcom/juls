import { ReactNode } from 'react';
import { AdminSidebar } from '@/components/admin/sidebar';
import { SignOutButton } from '@/components/admin/sign-out-button';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/admin/login');
  }
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto flex max-w-6xl gap-6">
        <AdminSidebar />
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between rounded-3xl border border-gray-200 bg-white px-6 py-4 shadow-card">
            <div>
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="font-semibold text-charcoal">{session.user?.email}</p>
            </div>
            <SignOutButton />
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
