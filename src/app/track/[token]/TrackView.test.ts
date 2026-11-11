// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import type { PublicTracking } from '@/application/ports/order-repository';
import { theme } from '@/styles/theme';
import TrackView from './TrackView';

const fetchTracking = vi.fn();
beforeEach(() => {
  vi.stubGlobal('fetch', fetchTracking);
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function showTracking(status: PublicTracking['status'], isDemo: boolean) {
  fetchTracking.mockResolvedValue({ ok: true, status: 200, json: async () => ({ status, isDemo, restaurantName: 'رستوران نمونه', createdAt: '2026-11-11T10:00:00Z', updatedAt: '2026-11-11T10:01:00Z' }) });
  return render(createElement(ThemeProvider, { theme }, createElement(TrackView, { token: 'tracking-token' })));
}

describe('tracking demo disclosures', () => {
  it.each(['pending_payment', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'canceled'] as const)('discloses no money and no real delivery in demo status %s', async status => {
    showTracking(status, true);
    await screen.findByText('این سفارش آزمایشی است.');
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('پیگیری سفارش آزمایشی');
    expect(screen.getByText(/مراحل آماده‌سازی، مسیر پیک و تحویل فقط نمایشی هستند و ارسال واقعی انجام نمی‌شود/)).toBeTruthy();
    expect(screen.queryByText('پرداخت تأیید شد و سفارش ثبت شد.')).toBeNull();
    expect(screen.queryByText('سفارش به پیک سپرده شده است.')).toBeNull();
    expect(screen.queryByText('سفارش به مقصد رسیده است. نوش جان!')).toBeNull();
    if (status === 'confirmed') expect(screen.getByText('پرداخت آزمایشی موفق ثبت شد. هیچ پولی جابه‌جا نشده است.')).toBeTruthy();
    if (status === 'delivering') expect(screen.getByText('مسیر پیک فقط نمایشی است؛ پیک واقعی اعزام نمی‌شود.')).toBeTruthy();
    if (status === 'delivered') expect(screen.getByText('روند نمایشی تحویل پایان یافته است؛ تحویل واقعی انجام نشده است.')).toBeTruthy();
  });
  it('preserves normal order confirmation and delivery wording', async () => {
    showTracking('delivered', false);
    await waitFor(() => expect(screen.getByText('سفارش به مقصد رسیده است. نوش جان!')).toBeTruthy());
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('پیگیری سفارش');
    expect(screen.getByText('پرداخت تأیید شد و سفارش ثبت شد.')).toBeTruthy();
    expect(screen.queryByText('این سفارش آزمایشی است.')).toBeNull();
  });
});
