import { DomainError } from '@/domain/shared/domain-error';

export const orderStatuses = [
  'pending_payment',
  'confirmed',
  'preparing',
  'ready',
  'delivering',
  'delivered',
  'canceled',
] as const;

export type OrderStatus = (typeof orderStatuses)[number];
export type OrderActor = 'customer' | 'operator' | 'payment_system';

const transitions: Readonly<Record<OrderStatus, readonly OrderStatus[]>> = {
  pending_payment: ['confirmed', 'canceled'],
  confirmed: ['preparing', 'canceled'],
  preparing: ['ready', 'canceled'],
  ready: ['delivering', 'canceled'],
  delivering: ['delivered'],
  delivered: [],
  canceled: [],
};

export function canTransitionOrder(from: OrderStatus, to: OrderStatus): boolean {
  return transitions[from].includes(to);
}

export function assertOrderTransition(from: OrderStatus, to: OrderStatus): void {
  if (!canTransitionOrder(from, to)) {
    throw new DomainError('INVALID_ORDER_TRANSITION', `Order cannot transition from ${from} to ${to}.`);
  }
}

export function assertCustomerCanCancel(status: OrderStatus): void {
  if (status !== 'pending_payment' && status !== 'confirmed') {
    throw new DomainError('ORDER_CANCEL_NOT_ALLOWED', `Customer cannot cancel an order in ${status}.`);
  }
}

export function assertActorCanTransition(
  actor: OrderActor,
  from: OrderStatus,
  to: OrderStatus,
): void {
  assertOrderTransition(from, to);

  if (actor === 'customer') {
    assertCustomerCanCancel(from);
    if (to !== 'canceled') {
      throw new DomainError('INVALID_ORDER_TRANSITION', 'Customers may only cancel eligible orders.');
    }
  }

  if (actor === 'payment_system' && !(from === 'pending_payment' && to === 'confirmed')) {
    throw new DomainError('INVALID_ORDER_TRANSITION', 'Payment system may only confirm pending orders.');
  }
}
