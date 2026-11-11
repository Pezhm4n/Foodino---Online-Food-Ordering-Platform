'use client';

import { useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { CHECKOUT_ATTEMPT_KEY, checkoutSubmissionKey, parseCheckoutSubmission } from '@/domain/cart/checkout-completion';

export default function CompleteCheckoutCart({ orderId, paymentStatus }: { orderId: string; paymentStatus: string }) {
  const { hydrated, clearSubmittedCart } = useCart();
  useEffect(() => {
    if (!hydrated || !['succeeded', 'failed', 'canceled'].includes(paymentStatus)) return;
    try {
      const key = checkoutSubmissionKey(orderId);
      const submission = parseCheckoutSubmission(localStorage.getItem(key));
      if (!submission) return;
      if (paymentStatus === 'succeeded') clearSubmittedCart(submission);
      const attempt = JSON.parse(localStorage.getItem(CHECKOUT_ATTEMPT_KEY) ?? 'null') as { id?: string } | null;
      if (attempt?.id === submission.attemptId) localStorage.removeItem(CHECKOUT_ATTEMPT_KEY);
      localStorage.removeItem(key);
    } catch {
      // Missing/corrupt storage never authorizes clearing a different cart.
    }
  }, [hydrated, clearSubmittedCart, orderId, paymentStatus]);
  return null;
}
