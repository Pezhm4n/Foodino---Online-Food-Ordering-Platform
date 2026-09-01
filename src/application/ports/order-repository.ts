import type { CheckoutInput } from '@/lib/validation/checkout';
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

export interface OrderRepository {
  createPending(input: CheckoutInput): Promise<PendingOrderResult>;
  cancelOwn(orderId: string, reason?: string): Promise<OrderStatus>;
  transition(orderId: string, toStatus: OrderStatus, reason?: string): Promise<OrderStatus>;
  getPublicTracking(token: string): Promise<PublicTracking | null>;
}
