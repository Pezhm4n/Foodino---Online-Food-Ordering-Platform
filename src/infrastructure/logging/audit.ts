import { logger } from './logger';

export type AuditAction =
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILED'
  | 'AUTH_REGISTER_SUCCESS'
  | 'AUTH_LOGOUT'
  | 'CHECKOUT_INITIATED'
  | 'ORDER_CREATED'
  | 'PAYMENT_CALLBACK_PROCESSED'
  | 'OPERATOR_ORDER_STATUS_CHANGED';

export interface AuditRecord {
  action: AuditAction;
  userId?: string;
  ipHash?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  requestId?: string;
}

export function logAuditEvent(record: AuditRecord) {
  logger.info(`AUDIT: ${record.action}`, {
    requestId: record.requestId,
    context: {
      action: record.action,
      userId: record.userId,
      ipHash: record.ipHash,
      resourceId: record.resourceId,
      details: record.details,
    },
  });
}
