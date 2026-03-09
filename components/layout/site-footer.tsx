import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-100 bg-brand-light/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-gray-600 md:grid-cols-3">
        <div>
          <p className="font-display text-xl text-brand-dark">Glow with Juls</p>
          <p className="mt-2 text-sm text-gray-600">Nationwide delivery across Ghana | Mobile Money accepted</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">Visit</p>
          <p className="mt-2">We operate fully online. Pickup is available on request in Accra.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-800">Contact</p>
          <p className="mt-2">Call: 0546817874</p>
          <p>
            Email:{' '}
            <Link href="mailto:glowwithjuls@gmail.com" className="text-brand-dark underline">
              glowwithjuls@gmail.com
            </Link>
          </p>
          <p>
            Instagram:{' '}
            <Link href="https://instagram.com/titiscosmeticshub" className="text-brand-dark underline" target="_blank" rel="noreferrer">
              @titiscosmeticshub
            </Link>
          </p>
        </div>
      </div>
      <div className="border-t border-white/50 bg-white/70 py-3 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Glow with Juls. Built for Ghana&apos;s beauty community.
      </div>
    </footer>
  );
}
