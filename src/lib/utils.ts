/**
 * تبدیل عدد به فرمت پول با علامت تومان
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fa-IR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount) + ' تومان';
}

/**
 * تبدیل تاریخ ISO به فرمت فارسی
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * کوتاه کردن متن و افزودن سه نقطه در صورت طولانی بودن
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
} 