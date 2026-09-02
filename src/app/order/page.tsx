import { permanentRedirect } from 'next/navigation';

export default function LegacyOrderPage() {
  permanentRedirect('/checkout');
}
 