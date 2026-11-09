import type { CheckoutInput, CheckoutQuoteInput } from '@/lib/validation/checkout';
import type { OrderStatus } from '@/domain/order/order-status';

export type PendingOrderResult = Readonly<{
  orderId: string;
  trackingToken: string | null;
  reused: boolean;
}>;

export type PublicTracking = Readonly<{
  status: OrderStatus;
  restaurantName: string;
  createdAt: string;
  updatedAt: string;
}>;

export type CheckoutQuote = Readonly<{
  subtotalIrr: number;
  deliveryFeeIrr: number;
  taxIrr: number;
  couponCode: string | null;
  discountIrr: number;
  totalIrr: number;
}>;

export interface OrderRepository {
  quote(input: CheckoutQuoteInput): Promise<CheckoutQuote>;
  createPending(input: CheckoutInput): Promise<PendingOrderResult>;
  cancelOwn(orderId: string, reason?: string): Promise<OrderStatus>;
  transition(orderId: string, toStatus: OrderStatus, reason?: string): Promise<OrderStatus>;
  getPublicTracking(token: string): Promise<PublicTracking | null>;
}
