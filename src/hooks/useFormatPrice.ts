import { useMemo } from 'react';

export const useFormatPrice = () => {
  // فرمت‌بندی قیمت به صورت فارسی و با تومان
  const formatPrice = useMemo(() => {
    return (price: number): string => {
      return price.toLocaleString('fa-IR') + ' تومان';
    };
  }, []);

  // فرمت‌بندی قیمت فقط با اعداد فارسی
  const formatPriceNumber = useMemo(() => {
    return (price: number): string => {
      return price.toLocaleString('fa-IR');
    };
  }, []);

  return { formatPrice, formatPriceNumber };
}; 