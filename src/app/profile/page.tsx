import { redirect } from 'next/navigation';
import ProfileView from '@/app/profile/ProfileView';
import { createSupabaseServerClient, requireClaims } from '@/infrastructure/supabase/server';

export default async function ProfilePage() {
  const claims = await requireClaims();
  if (!claims?.sub) redirect('/auth');
  const client = await createSupabaseServerClient();

  const [profileResult, addressesResult, favoritesResult, ordersResult] = await Promise.all([
    client.from('profiles').select('first_name,last_name,phone').eq('id', claims.sub).single(),
    client.from('addresses').select('id,title,recipient_name,address_line,city').order('created_at'),
    client.from('favorites').select('restaurants(id,name,slug)').order('created_at', { ascending: false }),
    client.from('orders').select('id,status,restaurant_name_snapshot,total_irr').order('created_at', { ascending: false }).limit(20),
  ]);
  if (profileResult.error) throw profileResult.error;
  if (addressesResult.error) throw addressesResult.error;
  if (favoritesResult.error) throw favoritesResult.error;
  if (ordersResult.error) throw ordersResult.error;

  return (
    <ProfileView
      profile={{
        firstName: profileResult.data.first_name,
        lastName: profileResult.data.last_name,
        email: typeof claims.email === 'string' ? claims.email : '',
        phone: profileResult.data.phone ?? '',
      }}
      addresses={addressesResult.data.map((address) => ({
        id: address.id,
        title: address.title,
        recipientName: address.recipient_name,
        addressLine: address.address_line,
        city: address.city,
      }))}
      favorites={favoritesResult.data.flatMap((favorite) => {
        const restaurant = favorite.restaurants;
        return restaurant ? [{ id: restaurant.id, name: restaurant.name, slug: restaurant.slug }] : [];
      })}
      orders={ordersResult.data.map((order) => ({
        id: order.id,
        status: order.status,
        restaurantName: order.restaurant_name_snapshot,
        totalIrr: order.total_irr,
      }))}
    />
  );
}
