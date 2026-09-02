import { money, type Money } from '@/domain/money/money';

export type CouponType = 'percentage' | 'fixed' | 'free_delivery';

export type Coupon = Readonly<{
  code: string;
  type: CouponType;
  discountPercentage?: number;
  maxDiscountIrr?: Money;
  minOrderIrr?: Money;
  discountIrr?: Money;
  description: string;
}>;

export const AVAILABLE_COUPONS: readonly Coupon[] = [
  {
    code: 'FOODINO',
    type: 'percentage',
    discountPercentage: 20,
    maxDiscountIrr: money(500_000), // 50,000 Tomans
    minOrderIrr: money(1_000_000),  // 100,000 Tomans
    description: '۲۰٪ تخفیف تا سقف ۵۰,۰۰۰ تومان (برای سفارش‌های بالای ۱۰۰ هزار تومان)',
  },
  {
    code: 'WELCOME',
    type: 'percentage',
    discountPercentage: 15,
    maxDiscountIrr: money(1_000_000), // 100,000 Tomans
    description: '۱۵٪ تخفیف اولین سفارش فودینو',
  },
  {
    code: 'FREESHIP',
    type: 'free_delivery',
    description: '۱۰۰٪ تخفیف روی هزینه ارسال',
  },
  {
    code: 'TASTY10',
    type: 'percentage',
    discountPercentage: 10,
    maxDiscountIrr: money(300_000), // 30,000 Tomans
    description: '۱۰٪ تخفیف ویژه منوی غذا',
  },
];

export type CouponValidationResult =
  | { readonly valid: true; readonly coupon: Coupon; readonly discount: Money; readonly message: string }
  | { readonly valid: false; readonly message: string };

export function validateAndApplyCoupon(
  code: string,
  subtotal: Money,
  deliveryFee: Money,
): CouponValidationResult {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { valid: false, message: 'لطفاً کد تخفیف را وارد کنید.' };
  }

  const coupon = AVAILABLE_COUPONS.find((c) => c.code === normalized);
  if (!coupon) {
    return { valid: false, message: 'کد تخفیف وارد شده معتبر نمی‌باشد.' };
  }

  if (coupon.minOrderIrr && subtotal.amountIrr < coupon.minOrderIrr.amountIrr) {
    const minToman = new Intl.NumberFormat('fa-IR').format(coupon.minOrderIrr.amountIrr / 10);
    return {
      valid: false,
      message: `این کد تخفیف برای سفارش‌های بالای ${minToman} تومان فعال می‌شود.`,
    };
  }

  if (coupon.type === 'free_delivery') {
    return {
      valid: true,
      coupon,
      discount: deliveryFee,
      message: 'هزینه ارسال رایگان شد!',
    };
  }

  if (coupon.type === 'fixed' && coupon.discountIrr) {
    const discountAmount = Math.min(coupon.discountIrr.amountIrr, subtotal.amountIrr);
    return {
      valid: true,
      coupon,
      discount: money(discountAmount),
      message: 'تخفیف با موفقیت اعمال شد.',
    };
  }

  if (coupon.type === 'percentage' && coupon.discountPercentage) {
    let rawDiscount = Math.round((subtotal.amountIrr * coupon.discountPercentage) / 1000) * 10;
    if (coupon.maxDiscountIrr && rawDiscount > coupon.maxDiscountIrr.amountIrr) {
      rawDiscount = coupon.maxDiscountIrr.amountIrr;
    }
    return {
      valid: true,
      coupon,
      discount: money(rawDiscount),
      message: `تخفیف ${coupon.discountPercentage}٪ با موفقیت اعمال شد.`,
    };
  }

  return { valid: false, message: 'امکان اعمال این کد تخفیف وجود ندارد.' };
}
