export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm uppercase tracking-[0.4em] text-brand-dark">404</p>
      <h1 className="mt-3 font-display text-4xl text-charcoal">Page not found</h1>
      <p className="mt-2 max-w-md text-gray-500">We could not find what you are looking for. Try exploring the shop.</p>
    </div>
  );
}
