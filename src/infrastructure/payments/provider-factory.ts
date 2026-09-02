import 'server-only';
import {
  PaymentProviderUnavailableError,
  type PaymentProvider,
} from '@/application/payments/payment-provider';
import { getServerEnv } from '@/infrastructure/config/server-env';
import { DevelopmentPaymentProvider } from '@/infrastructure/payments/development-payment-provider';

export function getPaymentProvider(): PaymentProvider {
  const env = getServerEnv();
  if (env.PAYMENT_PROVIDER === 'development' && env.NODE_ENV !== 'production') {
    return new DevelopmentPaymentProvider(env.PAYMENT_CALLBACK_SECRET, env.APP_URL);
  }
  throw new PaymentProviderUnavailableError();
}
