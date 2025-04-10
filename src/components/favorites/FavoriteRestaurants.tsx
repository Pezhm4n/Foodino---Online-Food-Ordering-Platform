"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { vazirmatn } from "@/app/fonts";

// تعریف انواع داده
interface Restaurant {
  id: string;
  name: string;
  icon: string;
  description: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  categories: string[];
}

interface FavoriteRestaurantsProps {
  isProfileView?: boolean;
}

// استایل‌های کامپوننت
const Container = styled.div<{ isProfileView?: boolean }>`
  width: 100%;
  padding: ${(props) => (props.isProfileView ? "0" : "2rem 1rem")};
  direction: rtl;
  font-family: var(--font-vazirmatn);
`;

const RestaurantsGrid = styled.div<{ isProfileView?: boolean }>`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${(props) => (props.isProfileView ? "250px" : "300px")}, 1fr)
  );
  gap: 1.5rem;
`;

const RestaurantCard = styled.div`
  background-color: white;
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: ${(props) => props.theme.boxShadow.sm};
  overflow: hidden;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${(props) => props.theme.boxShadow.md};
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  box-shadow: ${(props) => props.theme.boxShadow.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.error[500]};
  cursor: pointer;
  z-index: 10;

  &:hover {
    background-color: white;
    transform: scale(1.05);
  }
`;

const RestaurantImageContainer = styled.div`
  height: 180px;
  background-color: ${(props) => props.theme.colors.primary[400]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const RestaurantContent = styled.div`
  padding: 1.25rem;
`;

const RestaurantHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const RestaurantName = styled(Link)`
  font-size: ${(props) => props.theme.typography.fontSizes.lg};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  color: ${(props) => props.theme.colors.secondary[500]};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const RestaurantRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  color: ${(props) => props.theme.colors.neutral[800]};
`;

const RestaurantDescription = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.md};
  color: ${(props) => props.theme.colors.neutral[600]};
  margin-bottom: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RestaurantMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: ${(props) => props.theme.typography.fontSizes.sm};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${(props) => props.theme.colors.neutral[700]};
`;

const CategoryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CategoryTag = styled.span`
  font-size: ${(props) => props.theme.typography.fontSizes.xs};
  background-color: ${(props) => props.theme.colors.neutral[100]};
  color: ${(props) => props.theme.colors.neutral[700]};
  padding: 0.25rem 0.75rem;
  border-radius: ${(props) => props.theme.borderRadius.full};
`;

const EmptyFavorites = styled.div`
  text-align: center;
  padding: 3rem 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: ${(props) => props.theme.typography.fontSizes.xl};
  font-weight: ${(props) => props.theme.typography.fontWeights.semibold};
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.colors.secondary[500]};
`;

const EmptyDescription = styled.p`
  font-size: ${(props) => props.theme.typography.fontSizes.md};
  color: ${(props) => props.theme.colors.neutral[600]};
  margin-bottom: 1.5rem;
`;

const BrowseButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 2rem;
  background-color: ${(props) => props.theme.colors.primary[500]};
  color: white;
  font-weight: ${(props) => props.theme.typography.fontWeights.medium};
  border-radius: ${(props) => props.theme.borderRadius.md};
  text-decoration: none;
  font-size: ${(props) => props.theme.typography.fontSizes.md};

  &:hover {
    background-color: ${(props) => props.theme.colors.primary[600]};
  }
`;

// داده‌های نمونه
const sampleFavorites: Restaurant[] = [
  {
    id: "1",
    name: "پیتزا شیکاگو",
    icon: "🍕",
    description: "بهترین پیتزا ایتالیایی با خمیر تازه و مواد درجه یک",
    rating: 4.8,
    deliveryTime: "30-45 دقیقه",
    deliveryFee: "15,000 تومان",
    categories: ["پیتزا", "فست فود", "ایتالیایی"],
  },
  {
    id: "2",
    name: "کباب سرای سنتی",
    icon: "🍖",
    description: "انواع کباب‌های سنتی ایرانی با گوشت تازه و نان داغ",
    rating: 4.6,
    deliveryTime: "40-55 دقیقه",
    deliveryFee: "20,000 تومان",
    categories: ["کباب", "ایرانی", "سنتی"],
  },
  // ... می‌توانید رستوران‌های بیشتری اضافه کنید
];

const FavoriteRestaurants: React.FC<FavoriteRestaurantsProps> = ({
  isProfileView = false,
}) => {
  const [favorites, setFavorites] =
    React.useState<Restaurant[]>(sampleFavorites);

  const handleRemove = (id: string) => {
    setFavorites((prev) => prev.filter((restaurant) => restaurant.id !== id));
  };

  if (favorites.length === 0) {
    return (
      <EmptyFavorites>
        <EmptyTitle>هنوز رستورانی به علاقه‌مندی‌ها اضافه نکرده‌اید</EmptyTitle>
        <EmptyDescription>
          با مرور رستوران‌ها و افزودن آنها به علاقه‌مندی‌ها، می‌توانید به سرعت
          به رستوران‌های مورد علاقه خود دسترسی داشته باشید.
        </EmptyDescription>
        <BrowseButton href="/restaurants">مشاهده رستوران‌ها</BrowseButton>
      </EmptyFavorites>
    );
  }

  return (
    <Container isProfileView={isProfileView}>
      <RestaurantsGrid isProfileView={isProfileView}>
        {favorites.map((restaurant) => (
          <RestaurantCard key={restaurant.id}>
            <RemoveButton onClick={() => handleRemove(restaurant.id)}>
              <span className="material-icons">close</span>
            </RemoveButton>
            <RestaurantImageContainer>
              {restaurant.icon}
            </RestaurantImageContainer>
            <RestaurantContent>
              <RestaurantHeader>
                <RestaurantName href={`/restaurant/${restaurant.id}`}>
                  {restaurant.name}
                </RestaurantName>
                <RestaurantRating>
                  <span className="material-icons">star</span>
                  {restaurant.rating}
                </RestaurantRating>
              </RestaurantHeader>
              <RestaurantDescription>
                {restaurant.description}
              </RestaurantDescription>
              <RestaurantMeta>
                <MetaItem>
                  <span className="material-icons">schedule</span>
                  {restaurant.deliveryTime}
                </MetaItem>
                <MetaItem>
                  <span className="material-icons">delivery_dining</span>
                  {restaurant.deliveryFee}
                </MetaItem>
              </RestaurantMeta>
              <CategoryTags>
                {restaurant.categories.map((category) => (
                  <CategoryTag key={category}>{category}</CategoryTag>
                ))}
              </CategoryTags>
            </RestaurantContent>
          </RestaurantCard>
        ))}
      </RestaurantsGrid>
    </Container>
  );
};

export default FavoriteRestaurants;
