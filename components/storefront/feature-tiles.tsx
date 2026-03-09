const features = [
  {
    title: 'Nationwide delivery',
    description: 'Accra, Kumasi, Tamale, Takoradi and beyond via reliable courier partners.',
  },
  {
    title: 'Mobile Money + Paystack',
    description: 'Pay via MTN MoMo, Vodafone Cash, AirtelTigo, or card in secured Paystack checkout.',
  },
  {
    title: 'Wholesale ready',
    description: 'Bulk pricing for salons, spas, and resellers with stock visibility at a glance.',
  },
];

export function FeatureTiles() {
  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">
      {features.map((feature) => (
        <div key={feature.title} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-brand-dark">{feature.title}</p>
          <p className="mt-4 text-base text-gray-600">{feature.description}</p>
        </div>
      ))}
    </section>
  );
}
