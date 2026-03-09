import type { Metadata } from 'next';
import { AdminLoginForm } from '@/components/admin/login-form';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Secure login for Glow with Juls admin dashboard.',
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-card">
        <p className="text-sm uppercase tracking-[0.4em] text-brand-dark">Admin</p>
        <h1 className="mt-3 font-display text-3xl text-charcoal">Sign in</h1>
        <p className="mt-2 text-sm text-gray-500">Use the credentials seeded via environment variables.</p>
        <div className="mt-6">
          <AdminLoginForm />
        </div>
        <p className="mt-6 text-xs text-gray-500">
          Need help? <Link href="/contact" className="text-brand-dark">Talk to support</Link>
        </p>
      </div>
    </div>
  );
}
