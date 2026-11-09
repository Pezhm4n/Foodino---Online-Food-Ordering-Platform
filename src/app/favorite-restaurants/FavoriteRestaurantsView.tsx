'use client';

import React, { useState, useTransition } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { removeFavoriteAction } from '@/app/profile/actions';
import {
  DishArtwork,
  resolveFoodKind,
  FOOD_VISUAL_PALETTE,
  HeartIcon,
  StarIcon,
  ClockIcon,
  CourierIcon,
  SearchIcon,
  ArrowLeftIcon,
  UtensilsIcon,
} from '@/components/ui/FoodVisuals';

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
  max-width: 1180px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4.5rem;
  direction: rtl;
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
    margin-bottom: 2.25rem;
  }
`;

const HeaderInfo = styled.div`
  h1 {
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    font-weight: 900;
    color: ${props => props.theme.colors.neutral[900]};
    margin: 0 0 0.35rem;
  }

  p {
    font-size: 0.95rem;
    color: ${props => props.theme.colors.neutral[500]};
    margin: 0;
  }
`;

const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1rem;
  background-color: ${props => props.theme.colors.primary[50]};
  color: ${props => props.theme.colors.primary[600]};
  border: 1px solid ${props => props.theme.colors.primary[100]};
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 800;
  align-self: flex-start;
`;

const FilterContainer = styled.div`
  margin-bottom: 2rem;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  min-height: 50px;
  padding: 0.8rem 1rem 0.8rem 2.85rem;
  font-size: 0.95rem;
  border: 1.5px solid ${props => props.theme.colors.neutral[200]};
  border-radius: ${props => props.theme.borderRadius.xl};
  background-color: #ffffff;
  color: ${props => props.theme.colors.neutral[900]};
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary[100]};
  }
`;

const SearchIconWrap = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.neutral[400]};
  pointer-events: none;
  display: inline-flex;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 1.5rem;
`;

const RestaurantCard = styled.div`
  background: #ffffff;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  box-shadow: ${props => props.theme.shadows.sm};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.22s ease, box-shadow 0.22s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const CardCover = styled.div<{ $bg: string }>`
  height: 138px;
  background: ${props => props.$bg};
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.9rem;
  overflow: hidden;
`;

const CoverArtworkWrap = styled.div`
  position: absolute;
  left: 50%;
  bottom: -14px;
  transform: translateX(-50%);
  pointer-events: none;
`;

const RemoveButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary[500]};
  box-shadow: ${props => props.theme.shadows.xs};
  transition: transform 0.18s ease, background-color 0.18s ease;
  z-index: 2;

  &:hover {
    background: #ffffff;
    transform: scale(1.08);
  }
`;

const RatingBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.65rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  z-index: 2;

  svg {
    color: #E59A11;
  }
`;

const CardBody = styled.div`
  padding: 1.35rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const RestaurantName = styled.h3`
  font-size: 1.15rem;
  font-weight: 800;
  color: ${props => props.theme.colors.neutral[900]};
  margin: 0 0 0.4rem;
`;

const RestaurantDesc = styled.p`
  font-size: 0.86rem;
  color: ${props => props.theme.colors.neutral[600]};
  margin: 0 0 1rem;
  line-height: 1.6;
  flex: 1;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.85rem;
  border-top: 1px solid ${props => props.theme.colors.neutral[100]};
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props => props.theme.colors.neutral[600]};
  margin-bottom: 1.1rem;

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
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
  border-radius: ${props => props.theme.borderRadius.xl};
  font-size: 0.9rem;
  font-weight: 800;
  text-decoration: none;
  box-shadow: ${props => props.theme.shadows.brand};
  transition: background-color 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    background-color: ${props => props.theme.colors.primary[600]};
  }
`;

const ResetSearchBtn = styled.button`
  background: none;
  border: 1px solid ${props => props.theme.colors.primary[300]};
  color: ${props => props.theme.colors.primary[600]};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 0.45rem 1rem;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 0.75rem;
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.18s ease;

  &:hover {
    background: ${props => props.theme.colors.primary[50]};
  }
`;

const EmptyStateContainer = styled.div`
  background: #ffffff;
  border-radius: ${props => props.theme.borderRadius['2xl']};
  border: 1px solid ${props => props.theme.colors.neutral[200]};
  padding: 3.5rem 2rem;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.sm};
  max-width: 560px;
  margin: 2rem auto;
`;

const EmptyIcon = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 24px;
  background: ${props => props.theme.colors.primary[50]};
  color: ${props => props.theme.colors.primary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
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
  color: ${props => props.theme.colors.neutral[500]};
  line-height: 1.7;
  margin: 0 0 1.75rem;
`;

const ExploreButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 46px;
  padding: 0.8rem 1.85rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: white;
  border-radius: ${props => props.theme.borderRadius.xl};
  font-size: 0.95rem;
  font-weight: 800;
  text-decoration: none;
  box-shadow: ${props => props.theme.shadows.brand};
`;

export default function FavoriteRestaurantsView({
  initialFavorites,
}: Readonly<{ initialFavorites: FavoriteRestaurant[] }>) {
  const [favorites, setFavorites] = useState<FavoriteRestaurant[]>(initialFavorites);
  const [searchQuery, setSearchQuery] = useState('');
  const [, startTransition] = useTransition();

  const handleRemove = (restaurantId: string, restaurantName: string) => {
    setFavorites(prev => prev.filter(r => r.id !== restaurantId));
    toast.success(`${restaurantName} از علاقه‌مندی‌ها حذف شد.`);

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
            <HeartIcon size={16} filled />
            <span>{favorites.length.toLocaleString('fa-IR')} رستوران محبوب</span>
          </CountBadge>
        )}
      </HeaderSection>

      {favorites.length > 0 && (
        <FilterContainer>
          <SearchInput
            type="text"
            placeholder="جستجو در میان رستوران‌های محبوب..."
            aria-label="جستجو در میان رستوران‌های محبوب"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <SearchIconWrap>
            <SearchIcon size={18} />
          </SearchIconWrap>
        </FilterContainer>
      )}

      {favorites.length === 0 ? (
        <EmptyStateContainer>
          <EmptyIcon>
            <HeartIcon size={34} />
          </EmptyIcon>
          <EmptyTitle>لیست علاقه‌مندی‌های شما خالی است</EmptyTitle>
          <EmptyText>
            شما هنوز هیچ رستورانی را به لیست علاقه‌مندی‌های خود اضافه نکرده‌اید. با کلیک روی آیکون قلب در صفحه هر رستوران، آن را در این بخش ذخیره کنید.
          </EmptyText>
          <ExploreButton href="/restaurants">
            <UtensilsIcon size={17} />
            <span>کشف و مشاهده رستوران‌ها</span>
          </ExploreButton>
        </EmptyStateContainer>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6E6055' }}>
          <p style={{ fontSize: '1.05rem', fontWeight: 700 }}>رستورانی با عبارت «{searchQuery}» یافت نشد.</p>
          <ResetSearchBtn type="button" onClick={() => setSearchQuery('')}>
            پاک کردن جستجو و نمایش همه
          </ResetSearchBtn>
        </div>
      ) : (
        <Grid>
          {filtered.map(restaurant => {
            const foodKind = resolveFoodKind(`${restaurant.name} ${restaurant.slug} ${restaurant.description}`);
            const palette = FOOD_VISUAL_PALETTE[foodKind];
            return (
              <RestaurantCard key={restaurant.id}>
                <CardCover $bg={`linear-gradient(135deg, ${palette.bgStart} 0%, ${palette.bgEnd} 100%)`}>
                  <RatingBadge>
                    <StarIcon size={14} />
                    <span>{restaurant.rating.toLocaleString('fa-IR', { minimumFractionDigits: 1 })}</span>
                  </RatingBadge>
                  <RemoveButton
                    type="button"
                    onClick={() => handleRemove(restaurant.id, restaurant.name)}
                    title="حذف از علاقه‌مندی‌ها"
                    aria-label="حذف از علاقه‌مندی‌ها"
                  >
                    <HeartIcon size={18} filled />
                  </RemoveButton>
                  <CoverArtworkWrap>
                    <DishArtwork kind={foodKind} size={96} />
                  </CoverArtworkWrap>
                </CardCover>
                <CardBody>
                  <RestaurantName>{restaurant.name}</RestaurantName>
                  <RestaurantDesc>
                    {restaurant.description || 'انواع غذاهای باکیفیت و تازه با پخت روزانه'}
                  </RestaurantDesc>
                  <MetaRow>
                    <span>
                      <ClockIcon size={14} />
                      {restaurant.estimatedDeliveryMin.toLocaleString('fa-IR')} الی {restaurant.estimatedDeliveryMax.toLocaleString('fa-IR')} دقیقه
                    </span>
                    <span>
                      <CourierIcon size={14} />
                      {restaurant.deliveryFeeIrr > 0 ? `${(restaurant.deliveryFeeIrr / 10).toLocaleString('fa-IR')} تومان` : 'ارسال رایگان'}
                    </span>
                  </MetaRow>
                  <ViewMenuButton href={`/restaurants/${restaurant.slug}`} prefetch={true}>
                    <span>مشاهده منو و سفارش</span>
                    <ArrowLeftIcon size={15} />
                  </ViewMenuButton>
                </CardBody>
              </RestaurantCard>
            );
          })}
        </Grid>
      )}
    </PageContainer>
  );
}
