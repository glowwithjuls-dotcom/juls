const PAYSTACK_BASE = 'https://api.paystack.co';

async function paystackRequest(path: string, init?: RequestInit) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error('Missing PAYSTACK_SECRET_KEY');
  }

  const response = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Paystack error: ${text}`);
  }

  return response.json();
}

export async function initializePaystackTransaction(params: {
  amountInGhs: number;
  email: string;
  reference: string;
  metadata?: Record<string, unknown>;
  callbackUrl?: string;
}) {
  const payload = {
    email: params.email,
    amount: Math.round(params.amountInGhs * 100),
    reference: params.reference,
    currency: 'GHS',
    channels: ['card', 'mobile_money'],
    callback_url: params.callbackUrl ?? `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/checkout/success`,
    metadata: params.metadata,
  };

  return paystackRequest('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function verifyPaystack(reference: string) {
  return paystackRequest(`/transaction/verify/${reference}`);
}
