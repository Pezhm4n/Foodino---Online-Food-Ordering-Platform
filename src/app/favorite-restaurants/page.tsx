import { permanentRedirect } from 'next/navigation';

export default function LegacyFavoriteRestaurantsPage() {
  permanentRedirect('/profile');
}
