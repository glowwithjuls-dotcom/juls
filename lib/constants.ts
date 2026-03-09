export const BUSINESS = {
  name: "Glow with Juls",
  phones: ['0546817874'],
  email: 'glowwithjuls@gmail.com',
  socials: {
    instagram: 'https://instagram.com/titiscosmeticshub',
  },
  whatsapp: process.env.WHATSAPP_NUMBER ?? '233546817874',
};

export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'] as const;
