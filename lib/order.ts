export function generateOrderCode() {
  const now = new Date();
  const datePart = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `TITI-${datePart}-${randomPart}`;
}
