'use client';

import styled from 'styled-components';
import {
  createAddressAction,
  deleteAddressAction,
  removeFavoriteAction,
  updateProfileAction,
} from '@/app/profile/actions';

type ProfileViewProps = Readonly<{
  profile: { firstName: string; lastName: string; email: string; phone: string };
  addresses: readonly {
    id: string; title: string; recipientName: string; addressLine: string; city: string;
  }[];
  favorites: readonly { id: string; name: string; slug: string }[];
  orders: readonly { id: string; status: string; restaurantName: string; totalIrr: number }[];
}>;

const Page = styled.main`max-width: 960px; margin: 0 auto; padding: 2rem 1rem;`;
const Title = styled.h1`margin: 0 0 1.5rem; font-size: 2rem;`;
const Grid = styled.div`display: grid; gap: 1.5rem;`;
const Card = styled.section`
  padding: 1.5rem; border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: white; box-shadow: ${({ theme }) => theme.boxShadow.sm};
`;
const Form = styled.form`display: grid; gap: 1rem;`;
const Input = styled.input`
  width: 100%; padding: 0.75rem; border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;
const TextArea = styled.textarea`
  width: 100%; min-height: 6rem; padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;
const Fields = styled.div`
  display: grid; gap: 1rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) { grid-template-columns: repeat(2, 1fr); }
`;
const Button = styled.button`
  justify-self: start; padding: 0.65rem 1.25rem; border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md}; cursor: pointer;
  background: ${({ theme }) => theme.colors.primary[500]}; color: white;
`;
const DangerButton = styled(Button)`background: ${({ theme }) => theme.colors.error[500]};`;
const List = styled.ul`display: grid; gap: 0.75rem; padding: 0; list-style: none;`;
const Item = styled.li`
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 1rem; border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export default function ProfileView({ profile, addresses, favorites, orders }: ProfileViewProps) {
  return (
    <Page>
      <Title>پروفایل کاربری</Title>
      <Grid>
        <Card>
          <h2>اطلاعات حساب</h2>
          <Form action={updateProfileAction}>
            <Fields>
              <label>نام<Input name="firstName" defaultValue={profile.firstName} required /></label>
              <label>نام خانوادگی<Input name="lastName" defaultValue={profile.lastName} required /></label>
              <label>ایمیل<Input value={profile.email} disabled /></label>
              <label>تلفن<Input name="phone" defaultValue={profile.phone} inputMode="tel" /></label>
            </Fields>
            <Button type="submit">ذخیره تغییرات</Button>
          </Form>
        </Card>

        <Card>
          <h2>افزودن آدرس</h2>
          <Form action={createAddressAction}>
            <Fields>
              <label>عنوان<Input name="title" required /></label>
              <label>نام گیرنده<Input name="recipientName" required /></label>
              <label>تلفن گیرنده<Input name="recipientPhone" inputMode="tel" required /></label>
              <label>کد پستی<Input name="postalCode" inputMode="numeric" required /></label>
              <label>استان<Input name="province" required /></label>
              <label>شهر<Input name="city" required /></label>
            </Fields>
            <label>نشانی<TextArea name="addressLine" required /></label>
            <Button type="submit">ثبت آدرس</Button>
          </Form>
          <List>
            {addresses.map((address) => (
              <Item key={address.id}>
                <span><strong>{address.title}</strong> — {address.recipientName}، {address.city}، {address.addressLine}</span>
                <form action={deleteAddressAction}>
                  <input type="hidden" name="addressId" value={address.id} />
                  <DangerButton type="submit">حذف</DangerButton>
                </form>
              </Item>
            ))}
          </List>
        </Card>

        <Card>
          <h2>سفارش‌ها</h2>
          <List>{orders.map((order) => (
            <Item key={order.id}>
              <span>{order.restaurantName} — {order.status}</span>
              <span>{(order.totalIrr / 10).toLocaleString('fa-IR')} تومان</span>
            </Item>
          ))}</List>
        </Card>

        <Card>
          <h2>رستوران‌های مورد علاقه</h2>
          <List>{favorites.map((restaurant) => (
            <Item key={restaurant.id}>
              <a href={`/restaurants/${restaurant.slug}`}>{restaurant.name}</a>
              <form action={removeFavoriteAction}>
                <input type="hidden" name="restaurantId" value={restaurant.id} />
                <DangerButton type="submit">حذف</DangerButton>
              </form>
            </Item>
          ))}</List>
        </Card>
      </Grid>
    </Page>
  );
}
