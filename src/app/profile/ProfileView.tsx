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

const Page = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 2.5rem 1rem 4rem;
  direction: rtl;
`;

const Title = styled.h1`
  margin: 0 0 2rem;
  font-size: 2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.neutral[900]};
`;

const Grid = styled.div`
  display: grid;
  gap: 2rem;
`;

const Card = styled.section`
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.neutral[900]};
    margin: 0 0 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
    padding-bottom: 0.75rem;
  }
`;

const Form = styled.form`
  display: grid;
  gap: 1.25rem;
`;

const FieldLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.95rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    color: ${({ theme }) => theme.colors.neutral[500]};
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 5rem;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.95rem;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const Fields = styled.div`
  display: grid;
  gap: 1rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Button = styled.button`
  justify-self: start;
  padding: 0.75rem 1.75rem;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-1px);
  }
`;

const DangerButton = styled(Button)`
  padding: 0.45rem 0.9rem;
  font-size: 0.85rem;
  background: ${({ theme }) => theme.colors.error[50]};
  color: ${({ theme }) => theme.colors.error[600]};
  border: 1px solid ${({ theme }) => theme.colors.error[200]};

  &:hover {
    background: ${({ theme }) => theme.colors.error[500]};
    color: white;
  }
`;

const List = styled.ul`
  display: grid;
  gap: 0.75rem;
  padding: 0;
  margin: 1rem 0 0;
  list-style: none;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.neutral[50]};

  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${({ $status }) => {
    switch ($status) {
      case 'delivered': return '#dcfce7';
      case 'delivering': return '#ede9fe';
      case 'preparing': return '#ffedd5';
      case 'confirmed': return '#e0f2fe';
      case 'canceled': return '#fee2e2';
      default: return '#fef3c7';
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case 'delivered': return '#15803d';
      case 'delivering': return '#6d28d9';
      case 'preparing': return '#c2410c';
      case 'confirmed': return '#0369a1';
      case 'canceled': return '#b91c1c';
      default: return '#b45309';
    }
  }};
`;

const EmptyNotice = styled.p`
  color: ${({ theme }) => theme.colors.neutral[500]};
  font-size: 0.95rem;
  margin: 0;
  padding: 1rem 0;
  text-align: center;
`;

const statusLabels: Record<string, string> = {
  pending_payment: 'در انتظار پرداخت',
  confirmed: 'تأیید شده',
  preparing: 'در حال آماده‌سازی',
  ready: 'آماده ارسال',
  delivering: 'در حال ارسال',
  delivered: 'تحویل داده شد',
  canceled: 'لغو شده',
};

export default function ProfileView({ profile, addresses, favorites, orders }: ProfileViewProps) {
  return (
    <Page>
      <Title>پروفایل کاربری</Title>
      <Grid>
        <Card>
          <h2>👤 اطلاعات حساب کاربری</h2>
          <Form action={updateProfileAction}>
            <Fields>
              <FieldLabel>
                نام
                <Input name="firstName" defaultValue={profile.firstName} required />
              </FieldLabel>
              <FieldLabel>
                نام خانوادگی
                <Input name="lastName" defaultValue={profile.lastName} required />
              </FieldLabel>
              <FieldLabel>
                ایمیل
                <Input value={profile.email} disabled />
              </FieldLabel>
              <FieldLabel>
                تلفن همراه
                <Input name="phone" defaultValue={profile.phone} inputMode="tel" />
              </FieldLabel>
            </Fields>
            <Button type="submit">ذخیره تغییرات</Button>
          </Form>
        </Card>

        <Card>
          <h2>📍 نشانی‌های من</h2>
          <Form action={createAddressAction}>
            <Fields>
              <FieldLabel>
                عنوان آدرس (مثال: خانه، محل کار)
                <Input name="title" placeholder="خانه" required />
              </FieldLabel>
              <FieldLabel>
                نام تحویل‌گیرنده
                <Input name="recipientName" required />
              </FieldLabel>
              <FieldLabel>
                تلفن تحویل‌گیرنده
                <Input name="recipientPhone" inputMode="tel" required />
              </FieldLabel>
              <FieldLabel>
                کد پستی (۱۰ رقم)
                <Input name="postalCode" inputMode="numeric" required />
              </FieldLabel>
              <FieldLabel>
                استان
                <Input name="province" required />
              </FieldLabel>
              <FieldLabel>
                شهر
                <Input name="city" required />
              </FieldLabel>
            </Fields>
            <FieldLabel>
              نشانی دقیق پستی
              <TextArea name="addressLine" placeholder="خیابان، کوچه، پلاک، واحد..." required />
            </FieldLabel>
            <Button type="submit">ثبت آدرس جدید</Button>
          </Form>

          {addresses.length === 0 ? (
            <EmptyNotice>هنوز نشانی ثبت نشده است.</EmptyNotice>
          ) : (
            <List>
              {addresses.map((address) => (
                <Item key={address.id}>
                  <div>
                    <strong style={{ color: '#1e293b' }}>{address.title}</strong>
                    <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                      {address.recipientName} ({address.city}، {address.addressLine})
                    </p>
                  </div>
                  <form action={deleteAddressAction}>
                    <input type="hidden" name="addressId" value={address.id} />
                    <DangerButton type="submit">حذف آدرس</DangerButton>
                  </form>
                </Item>
              ))}
            </List>
          )}
        </Card>

        <Card>
          <h2>📦 تاریخچه سفارش‌ها</h2>
          {orders.length === 0 ? (
            <EmptyNotice>هنوز سفارشی ثبت نکرده‌اید.</EmptyNotice>
          ) : (
            <List>
              {orders.map((order) => (
                <Item key={order.id}>
                  <div>
                    <strong style={{ color: '#1e293b' }}>{order.restaurantName}</strong>
                    <div style={{ marginTop: '0.35rem' }}>
                      <StatusBadge $status={order.status}>
                        {statusLabels[order.status] ?? order.status}
                      </StatusBadge>
                    </div>
                  </div>
                  <strong style={{ color: '#ff5a00' }}>
                    {(order.totalIrr / 10).toLocaleString('fa-IR')} تومان
                  </strong>
                </Item>
              ))}
            </List>
          )}
        </Card>

        <Card>
          <h2>❤️ رستوران‌های مورد علاقه</h2>
          {favorites.length === 0 ? (
            <EmptyNotice>رستوران مورد علاقه‌ای اضافه نشده است.</EmptyNotice>
          ) : (
            <List>
              {favorites.map((restaurant) => (
                <Item key={restaurant.id}>
                  <a
                    href={`/restaurants/${restaurant.slug}`}
                    style={{ fontWeight: 600, color: '#ff5a00', textDecoration: 'none' }}
                  >
                    {restaurant.name}
                  </a>
                  <form action={removeFavoriteAction}>
                    <input type="hidden" name="restaurantId" value={restaurant.id} />
                    <DangerButton type="submit">حذف</DangerButton>
                  </form>
                </Item>
              ))}
            </List>
          )}
        </Card>
      </Grid>
    </Page>
  );
}
