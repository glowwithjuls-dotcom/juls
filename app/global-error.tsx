'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-rose-50 px-4 text-center">
      <p className="text-sm uppercase tracking-[0.4em] text-brand-dark">Something went wrong</p>
      <p className="text-xl font-semibold text-charcoal">{error.message}</p>
      <button className="rounded-full bg-brand px-4 py-2 text-white" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
