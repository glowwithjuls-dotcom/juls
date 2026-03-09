import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth-helpers';

function escapeCsv(value: unknown) {
  const str = value === null || value === undefined ? '' : String(value);
  const sanitized = str.replace(/"/g, '""');
  return `"${sanitized}"`;
}

export async function GET() {
  await requireAdminSession();
  const orders = await prisma.order.findMany({ include: { customer: true } });
  const header = 'Order Code,Customer,Phone,Total,Status,Payment Status';
  const rows = orders.map((order) =>
    [order.orderCode, order.customer.fullName, order.customer.phone, Number(order.total), order.orderStatus, order.paymentStatus]
      .map(escapeCsv)
      .join(','),
  );
  const csv = [header, ...rows].join('\n');
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="orders.csv"',
    },
  });
}


