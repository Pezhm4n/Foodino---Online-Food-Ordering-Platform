import { permanentRedirect } from 'next/navigation';

export default function LegacyMenuPage() {
  permanentRedirect('/restaurants');
}
