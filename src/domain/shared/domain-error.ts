export type DomainErrorCode =
  | 'INVALID_MONEY'
  | 'INVALID_QUANTITY'
  | 'CART_RESTAURANT_CONFLICT'
  | 'INVALID_ORDER_TRANSITION'
  | 'ORDER_CANCEL_NOT_ALLOWED'
  | 'INVALID_PAYMENT_TRANSITION';

export class DomainError extends Error {
  constructor(
    public readonly code: DomainErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}
