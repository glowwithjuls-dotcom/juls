import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal('')),
  region: z.string().min(2),
  city: z.string().min(2),
  address: z.string().min(5),
  paymentMethod: z.enum(['MOBILE_MONEY', 'CARD', 'PAY_ON_DELIVERY']),
  notes: z.string().optional(),
});

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  categoryId: z.string().min(1),
  price: z.number().positive(),
  wholesalePrice: z.number().nonnegative().optional(),
  stockQuantity: z.number().int().nonnegative(),
  description: z.string().min(10),
  imageUrl: z.string().url().optional(),
  featured: z.boolean().optional(),
});

export const deliveryZoneSchema = z.object({
  id: z.string().optional(),
  zone: z.string().min(2),
  regions: z.array(z.string().min(2)),
  fee: z.number().positive(),
});

export const settingsSchema = z.object({
  allowPayOnDelivery: z.boolean(),
  whatsappNumber: z.string().min(10),
  supportEmail: z.string().email(),
  supportPhone: z.string().min(10),
});

export const contactSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().min(10),
});
