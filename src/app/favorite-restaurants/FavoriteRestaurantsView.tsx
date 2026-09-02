'use client';

import React, { useState, useTransition } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { removeFavoriteAction } from '@/app/profile/actions';

export interface FavoriteRestaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoPath: string | null;
  coverPath: string | null;
  rating: number;
  deliveryFeeIrr: number;
  estimatedDeliveryMin: number;
  estimatedDeliveryMax: number;
  isActive: boolean;
}

const PageContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 1rem 4rem;
  direction: rtl;
  font-family: var(--font-vazirmatn);

  @media (min-width: 768px) {
    padding: 2.5rem 1.5rem 5rem;
  }
`;

const HeaderSection = styled.div`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 2.5rem;
  }
`;

const HeaderInfo = styled.div`
  h1 {
    font-size: 1.5rem;
    font-weight: 800;
    color: ${props => props.theme.colors.neutral[900]};
    margin: 0 0 0.35rem;

    @media (min-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.neutral[600]};
    margin: 0;

    @media (min-width: 768px) {
      font-size: 1rem;
    }
  }
`;

const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.9rem;
  background-color: #fff1f2;
  color: #e11d48;
  border: 1px solid #fecdd3;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 700;
  align-self: flex-start;

  @media (min-width: 768px) {
    align-self: auto;
  }
`;

const FilterContainer = styled.div`
  margin-bottom: 2rem;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  min-height: 48px;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  font-size: 0.95rem;
  border: 1.5px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.xl};
  background-color: white;
  color: ${props => props.theme.colors.neutral[900]};
  font-family: var(--font-vazirmatn);
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px rgba(255, 90, 0, 0.15);
  }

  &::placeholder {
    color: ${props => props.theme.colors.neutral[400]};
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.neutral[400]};
  pointer-events: none;
  font-size: 1.1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
`;

const RestaurantCard = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  }
`;

const CardCover = styled.div<{ $bg?: string | null }>`
  height: 120px;
  background: ${props => props.$bg ? `url(${props.$bg}) center/cover no-repeat` : 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)'};
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.75rem;
`;

const RemoveButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e11d48;
  font-size: 1.1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;

  &:hover {
    background: white;
    transform: scale(1.1);
    color: #be123c;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const RatingBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.6rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #b45309;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const CardBody = styled.div`
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const RestaurantName = styled.h3`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${props => props.theme.colors.neutral[900]};
  margin: 0 0 0.4rem;
`;

const RestaurantDesc = styled.p`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.neutral[600]};
  margin: 0 0 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid ${props => props.theme.colors.neutral[100]};
  font-size: 0.8rem;
  color: ${props => props.theme.colors.neutral[500]};
  margin-bottom: 1rem;
`;

const ViewMenuButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  min-height: 44px;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(255, 90, 0, 0.2);
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primary[600]};
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(255, 90, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EmptyStateContainer = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  padding: 3rem 1.5rem;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  max-width: 540px;
  margin: 2rem auto;
`;

const EmptyIcon = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #fff1f2;
  color: #e11d48;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.25rem;
  margin: 0 auto 1.25rem;
`;

const EmptyTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  margin: 0 0 0.5rem;
`;

const EmptyText = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.neutral[600]};
  line-height: 1.6;
  margin: 0 0 1.75rem;
`;

const ExploreButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 46px;
  padding: 0.75rem 2rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(255, 90, 0, 0.25);
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primary[600]};
    transform: translateY(-1px);
  }
`;

export default function FavoriteRestaurantsView({
  initialFavorites,
}: Readonly<{ initialFavorites: FavoriteRestaurant[] }>) {
  const [favorites, setFavorites] = useState<FavoriteRestaurant[]>(initialFavorites);
  const [searchQuery, setSearchQuery] = useState('');
  const [, startTransition] = useTransition();

  const handleRemove = (restaurantId: string, restaurantName: string) => {
    setFavorites(prev => prev.filter(r => r.id !== restaurantId));
    toast.success(`${restaurantName} از علاقه‌مندی‌ها حذف شد.`, { icon: '🗑️' });

    startTransition(async () => {
      const fd = new FormData();
      fd.append('restaurantId', restaurantId);
      try {
        await removeFavoriteAction(fd);
      } catch {
        toast.error('خطا در همگام‌سازی با سرور');
      }
    });
  };

  const filtered = favorites.filter(r =>
    r.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <PageContainer>
      <HeaderSection>
        <HeaderInfo>
          <h1>رستوران‌های مورد علاقه</h1>
          <p>دسترسی مستقیم و سریع به رستوران‌های محبوب و نشان‌شده شما</p>
        </HeaderInfo>
        {favorites.length > 0 && (
          <CountBadge>
            <span>❤️</span>
            <span>{favorites.length} رستوران محبوب</span>
          </CountBadge>
        )}
      </HeaderSection>

      {favorites.length > 0 && (
        <FilterContainer>
          <SearchInput
            type="text"
            placeholder="جستجو در میان رستوران‌های محبوب..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <SearchIcon>🔍</SearchIcon>
        </FilterContainer>
      )}

      {favorites.length === 0 ? (
        <EmptyStateContainer>
          <EmptyIcon>❤️</EmptyIcon>
          <EmptyTitle>لیست علاقه‌مندی‌های شما خالی است</EmptyTitle>
          <EmptyText>
            شما هنوز هیچ رستورانی را به لیست علاقه‌مندی‌های خود اضافه نکرده‌اید. با کلیک روی آیکون قلب در صفحه هر رستوران، آن را در این بخش ذخیره کنید.
          </EmptyText>
          <ExploreButton href="/restaurants">
            <span>🍽️ کشف و مشاهده رستوران‌ها</span>
          </ExploreButton>
        </EmptyStateContainer>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>رستورانی با عبارت «{searchQuery}» یافت نشد.</p>
        </div>
      ) : (
        <Grid>
          {filtered.map(restaurant => (
            <RestaurantCard key={restaurant.id}>
              <CardCover $bg={restaurant.coverPath}>
                <RatingBadge>
                  <span>★</span>
                  <span>{restaurant.rating.toFixed(1)}</span>
                </RatingBadge>
                <RemoveButton
                  type="button"
                  onClick={() => handleRemove(restaurant.id, restaurant.name)}
                  title="حذف از علاقه‌مندی‌ها"
                  aria-label="حذف از علاقه‌مندی‌ها"
                >
                  ❤️
                </RemoveButton>
              </CardCover>
              <CardBody>
                <RestaurantName>{restaurant.name}</RestaurantName>
                <RestaurantDesc>
                  {restaurant.description || 'انواع غذاهای باکیفیت و تازه'}
                </RestaurantDesc>
                <MetaRow>
                  <span>⚡ {restaurant.estimatedDeliveryMin} الی {restaurant.estimatedDeliveryMax} دقیقه</span>
                  <span>{restaurant.deliveryFeeIrr > 0 ? `${(restaurant.deliveryFeeIrr / 10).toLocaleString('fa-IR')} تومان` : 'ارسال رایگان'}</span>
                </MetaRow>
                <ViewMenuButton href={`/restaurants/${restaurant.slug}`} prefetch={true}>
                  <span>مشاهده منو و سفارش</span>
                  <span>←</span>
                </ViewMenuButton>
              </CardBody>
            </RestaurantCard>
          ))}
        </Grid>
      )}
    </PageContainer>
  );
}
