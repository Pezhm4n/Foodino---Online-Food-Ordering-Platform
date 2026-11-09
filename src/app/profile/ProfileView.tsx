'use client';

import Link from 'next/link';
import styled from 'styled-components';
import {
  createAddressAction,
  deleteAddressAction,
  removeFavoriteAction,
  updateProfileAction,
} from '@/app/profile/actions';
import {
  UserIcon,
  MapPinIcon,
  BagIcon,
  HeartIcon,
  ArrowLeftIcon,
  TrashIcon,
} from '@/components/ui/FoodVisuals';

type ProfileViewProps = Readonly<{
  profile: { firstName: string; lastName: string; email: string; phone: string };
  addresses: readonly {
    id: string; title: string; recipientName: string; addressLine: string; city: string;
  }[];
  favorites: readonly { id: string; name: string; slug: string }[];
  orders: readonly { id: string; status: string; restaurantName: string; totalIrr: number }[];
}>;

const Page = styled.div`
  max-width: 1020px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4.5rem;
  direction: rtl;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1.5rem 1rem 3rem;
  }
`;

const HeaderBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  background: linear-gradient(135deg, #1F1814 0%, #31251E 100%);
  color: #FAF6F0;
  box-shadow: ${({ theme }) => theme.shadows.md};
  flex-wrap: wrap;
`;

const Title = styled.h1`
  margin: 0 0 0.25rem;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 900;
  color: #ffffff;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: rgba(250, 246, 240, 0.75);
`;

const Grid = styled.div`
  display: grid;
  gap: 1.75rem;
`;

const Card = styled.section`
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  background: #ffffff;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1.25rem 1rem;
    border-radius: ${({ theme }) => theme.borderRadius.xl};
  }

  h2 {
    font-size: 1.2rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.neutral[900]};
    margin: 0 0 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
    padding-bottom: 0.85rem;
  }
`;

const SectionIconWrap = styled.span`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[600]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Form = styled.form`
  display: grid;
  gap: 1.25rem;
`;

const FieldLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  font-size: 0.86rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 0.95rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    background: #ffffff;
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
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 0.95rem;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    background: #ffffff;
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
  padding: 0.8rem 1.75rem;
  border: 0;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  cursor: pointer;
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  font-weight: 800;
  font-size: 0.92rem;
  min-height: 44px;
  box-shadow: ${({ theme }) => theme.shadows.brand};
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-1px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    justify-self: stretch;
  }
`;

const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.9rem;
  font-size: 0.82rem;
  font-weight: 700;
  min-height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  background: ${({ theme }) => theme.colors.error[50]};
  color: ${({ theme }) => theme.colors.error[600]};
  border: 1px solid ${({ theme }) => theme.colors.error[100]};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.error[500]};
    color: white;
  }
`;

const List = styled.ul`
  display: grid;
  gap: 0.75rem;
  padding: 0;
  margin: 1.25rem 0 0;
  list-style: none;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme }) => theme.colors.neutral[50]};
  flex-wrap: wrap;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
  background-color: ${({ $status }) => {
    switch ($status) {
      case 'delivered': return '#ECFDF5';
      case 'canceled': return '#FEF2F2';
      default: return '#FFF5F2';
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case 'delivered': return '#15803D';
      case 'canceled': return '#DC2626';
      default: return '#D9381E';
    }
  }};
`;

const EmptyNotice = styled.p`
  color: ${({ theme }) => theme.colors.neutral[500]};
  font-size: 0.92rem;
  margin: 0;
  padding: 1.25rem 0;
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
      <HeaderBanner>
        <div>
          <Title>پروفایل کاربری</Title>
          <Subtitle>مدیریت مشخصات فردی، نشانی‌های منتخب و تاریخچه سفارش‌ها در فودینو</Subtitle>
        </div>
      </HeaderBanner>

      <Grid>
        <Card>
          <h2>
            <SectionIconWrap>
              <UserIcon size={18} />
            </SectionIconWrap>
            <span>اطلاعات حساب کاربری</span>
          </h2>
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
          <h2>
            <SectionIconWrap>
              <MapPinIcon size={18} />
            </SectionIconWrap>
            <span>نشانی‌های من</span>
          </h2>
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
                    <strong style={{ color: '#16120F' }}>{address.title}</strong>
                    <p style={{ margin: '0.25rem 0 0', color: '#6E6055', fontSize: '0.88rem' }}>
                      {address.recipientName} ({address.city}، {address.addressLine})
                    </p>
                  </div>
                  <form action={deleteAddressAction}>
                    <input type="hidden" name="addressId" value={address.id} />
                    <DangerButton type="submit">
                      <TrashIcon size={14} />
                      <span>حذف آدرس</span>
                    </DangerButton>
                  </form>
                </Item>
              ))}
            </List>
          )}
        </Card>

        <Card>
          <h2>
            <SectionIconWrap>
              <BagIcon size={18} />
            </SectionIconWrap>
            <span>تاریخچه سفارش‌ها</span>
          </h2>
          {orders.length === 0 ? (
            <EmptyNotice>هنوز سفارشی ثبت نکرده‌اید.</EmptyNotice>
          ) : (
            <List>
              {orders.map((order) => (
                <Item key={order.id}>
                  <div>
                    <strong style={{ color: '#16120F' }}>{order.restaurantName}</strong>
                    <div style={{ marginTop: '0.35rem' }}>
                      <StatusBadge $status={order.status}>
                        {statusLabels[order.status] ?? order.status}
                      </StatusBadge>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                    <strong style={{ color: '#D9381E', fontSize: '0.95rem' }}>
                      {(order.totalIrr / 10).toLocaleString('fa-IR')} تومان
                    </strong>
                    <Link
                      href={`/orders/${order.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.45rem 0.85rem',
                        borderRadius: '0.65rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#B82B14',
                        background: '#FFF5F2',
                        border: '1px solid #FFD8CE',
                        textDecoration: 'none',
                      }}
                    >
                      <span>جزئیات و فاکتور</span>
                      <ArrowLeftIcon size={14} />
                    </Link>
                  </div>
                </Item>
              ))}
            </List>
          )}
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #F3ECE2', paddingBottom: '0.85rem' }}>
            <h2 style={{ margin: 0, border: 0, padding: 0 }}>
              <SectionIconWrap>
                <HeartIcon size={18} />
              </SectionIconWrap>
              <span>رستوران‌های مورد علاقه</span>
            </h2>
            <Link
              href="/favorite-restaurants"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: '#D9381E', fontWeight: 700, textDecoration: 'none' }}
            >
              <span>مدیریت و مشاهده کامل</span>
              <ArrowLeftIcon size={14} />
            </Link>
          </div>
          {favorites.length === 0 ? (
            <EmptyNotice>رستوران مورد علاقه‌ای اضافه نشده است.</EmptyNotice>
          ) : (
            <List>
              {favorites.map((restaurant) => (
                <Item key={restaurant.id}>
                  <a
                    href={`/restaurants/${restaurant.slug}`}
                    style={{ fontWeight: 800, color: '#16120F', textDecoration: 'none' }}
                  >
                    {restaurant.name}
                  </a>
                  <form action={removeFavoriteAction}>
                    <input type="hidden" name="restaurantId" value={restaurant.id} />
                    <DangerButton type="submit">
                      <TrashIcon size={14} />
                      <span>حذف</span>
                    </DangerButton>
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
