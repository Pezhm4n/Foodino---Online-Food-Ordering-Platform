import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { paymentCallbackSchema } from '@/lib/validation/payment';
import type {
  CreatedPayment,
  CreatePaymentInput,
  PaymentProvider,
  VerifiedPaymentEvent,
} from '@/application/payments/payment-provider';

type CompletionToken = Readonly<{
  orderId: string;
  providerReference: string;
  amountIrr: number;
  expiresAt: number;
}>;

function signature(secret: string, value: string): string {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function signaturesMatch(expected: string, actual: string): boolean {
  const expectedBytes = Buffer.from(expected);
  const actualBytes = Buffer.from(actual);
  return expectedBytes.length === actualBytes.length && timingSafeEqual(expectedBytes, actualBytes);
}

export class DevelopmentPaymentProvider implements PaymentProvider {
  readonly name = 'development';

  constructor(
    private readonly secret: string,
    private readonly appUrl: string,
  ) {}

  async createPayment(input: CreatePaymentInput): Promise<CreatedPayment> {
    const providerReference = `development:${input.orderId}`;
    const payload: CompletionToken = {
      orderId: input.orderId,
      providerReference,
      amountIrr: input.amountIrr,
      expiresAt: Date.now() + 15 * 60 * 1000,
    };
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const token = `${encoded}.${signature(this.secret, encoded)}`;
    return {
      provider: this.name,
      providerReference,
      redirectUrl: `${this.appUrl}/api/payments/development/complete?token=${encodeURIComponent(token)}`,
    };
  }

  async verifyCallback(rawBody: string, headers: Headers): Promise<VerifiedPaymentEvent> {
    const suppliedSignature = headers.get('x-foodino-signature') ?? '';
    const expectedSignature = signature(this.secret, rawBody);
    if (!signaturesMatch(expectedSignature, suppliedSignature)) throw new Error('INVALID_SIGNATURE');

    let input: unknown;
    try {
      input = JSON.parse(rawBody);
    } catch {
      throw new Error('INVALID_CALLBACK');
    }
    const parsed = paymentCallbackSchema.safeParse(input);
    if (!parsed.success) throw new Error('INVALID_CALLBACK');
    return {
      provider: this.name,
      ...parsed.data,
      payloadHashHex: createHash('sha256').update(rawBody).digest('hex'),
    };
  }

  verifyCompletionToken(token: string): CompletionToken {
    const [encoded, suppliedSignature, ...rest] = token.split('.');
    if (!encoded || !suppliedSignature || rest.length > 0) throw new Error('INVALID_TOKEN');
    if (!signaturesMatch(signature(this.secret, encoded), suppliedSignature)) throw new Error('INVALID_TOKEN');

    let value: unknown;
    try {
      value = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    } catch {
      throw new Error('INVALID_TOKEN');
    }
    if (!value || typeof value !== 'object') throw new Error('INVALID_TOKEN');
    const tokenValue = value as Partial<CompletionToken>;
    if (
      typeof tokenValue.orderId !== 'string'
      || typeof tokenValue.providerReference !== 'string'
      || typeof tokenValue.amountIrr !== 'number'
      || !Number.isSafeInteger(tokenValue.amountIrr)
      || typeof tokenValue.expiresAt !== 'number'
      || tokenValue.expiresAt < Date.now()
    ) throw new Error('INVALID_TOKEN');
    return tokenValue as CompletionToken;
  }

  createSuccessfulCallback(token: CompletionToken): { rawBody: string; headers: Headers } {
    const rawBody = JSON.stringify({
      providerEventId: `completion:${token.orderId}`,
      providerReference: token.providerReference,
      status: 'succeeded',
      amountIrr: token.amountIrr,
    });
    return {
      rawBody,
      headers: new Headers({ 'x-foodino-signature': signature(this.secret, rawBody) }),
    };
  }
}
