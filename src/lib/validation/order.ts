import { z } from 'zod';
import { orderStatuses } from '@/domain/order/order-status';

export const orderStatusSchema = z.enum(orderStatuses);
