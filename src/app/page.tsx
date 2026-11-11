import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import PopularCategories, { type CategoryItem } from '@/components/home/PopularCategories';
import FeaturedDishes, { type FeaturedDish } from '@/components/home/FeaturedDishes';
import TopRestaurants from '@/components/home/TopRestaurants';
import QualityBadges, { type LandingReview } from '@/components/home/QualityBadges';
import LandingReveal from '@/components/home/LandingReveal';
import { createSupabasePublicClient } from '@/infrastructure/supabase/public';
import { MOCK_PRODUCTS, MOCK_RESTAURANTS, MOCK_REVIEWS } from '@/infrastructure/mock/mock-catalog-data';
import { irrToToman, money } from '@/domain/money/money';
import { SupabaseCatalogRepository } from '@/infrastructure/supabase/repositories/supabase-catalog-repository';

const featuredSlugs = ['best-pizza-special', 'traditional-kebab', 'burger-land-classic', 'sushi-tako-salmon'];

async function loadFeatured(client: ReturnType<typeof createSupabasePublicClient>): Promise<FeaturedDish[]> {
  if (process.env.DEMO_MODE === 'true') {
    return featuredSlugs.flatMap((slug) => {
      const dish = MOCK_PRODUCTS.find((product) => product.slug === slug);
      const restaurant = MOCK_RESTAURANTS.find(({ id }) => id === dish?.restaurantId);
      return dish && restaurant ? [{
        id: dish.id, slug, name: dish.name, description: dish.description,
        price: irrToToman(dish.price), restaurantName: restaurant.name,
        restaurantId: restaurant.id, restaurantRating: restaurant.rating, deliveryMinutes: restaurant.deliveryMinutes,
      }] : [];
    });
  }

  const { data } = await client.from('products')
    .select('id,slug,name,description,price_irr,restaurant_id,restaurants!inner(name,is_active,rating,estimated_delivery_min,estimated_delivery_max)')
    .in('slug', featuredSlugs)
    .eq('is_available', true)
    .eq('restaurants.is_active', true);
  return featuredSlugs.flatMap((slug) => {
    const dish = data?.find((product) => product.slug === slug);
    return dish ? [{
      id: dish.id, slug, name: dish.name, description: dish.description ?? '',
      price: irrToToman(money(dish.price_irr)), restaurantName: dish.restaurants.name,
      restaurantId: dish.restaurant_id, restaurantRating: dish.restaurants.rating,
      deliveryMinutes: { min: dish.restaurants.estimated_delivery_min, max: dish.restaurants.estimated_delivery_max },
    }] : [];
  });
}

async function loadLandingReviews(client: ReturnType<typeof createSupabasePublicClient>, demo: boolean): Promise<LandingReview[]> {
  if (demo) {
    return [MOCK_REVIEWS[0], MOCK_REVIEWS[2], MOCK_REVIEWS[4]].flatMap((review) => {
      const restaurant = MOCK_RESTAURANTS.find((item) => item.id === review.restaurantId);
      return restaurant ? [{
        id: review.id, userName: review.userName, rating: review.rating, comment: review.comment,
        foodName: review.foodName ?? '', restaurantName: restaurant.name, restaurantSlug: restaurant.slug,
      }] : [];
    });
  }

  const { data } = await client.from('reviews')
    .select('id,user_name,rating,comment,food_name,restaurants!inner(name,slug,is_active)')
    .eq('restaurants.is_active', true)
    .order('created_at', { ascending: false })
    .order('id')
    .limit(3);
  return (data ?? []).map((review) => ({
    id: review.id, userName: review.user_name, rating: review.rating, comment: review.comment,
    foodName: review.food_name, restaurantName: review.restaurants.name, restaurantSlug: review.restaurants.slug,
  }));
}

export default async function HomePage() {
  const client = createSupabasePublicClient();
  const featured = loadFeatured(client);
  const restaurants = new SupabaseCatalogRepository(client)
    .listRestaurants({ sort: 'rating_desc', limit: 4 })
    .then(({ items }) => items)
    .catch(() => []);
  const demoMode = process.env.DEMO_MODE === 'true';
  const reviews = loadLandingReviews(client, demoMode);
  let categories: CategoryItem[] = [];
  if (!demoMode) {
    try {
      const { data: categoriesData } = await client
        .from('categories')
        .select(`
          id,
          name,
          slug,
          icon,
          sort_order,
          restaurant_categories (
            restaurants (
              id,
              is_active
            )
          )
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (categoriesData && categoriesData.length > 0) {
        categories = categoriesData.map((cat) => {
          const activeCount = (cat.restaurant_categories ?? []).filter(
            (rc) => rc.restaurants?.is_active
          ).length;
          return {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            icon: cat.icon || 'chef',
            count: activeCount,
          };
        });
      }
    } catch {
      // The rest of the homepage stays available if categories cannot be loaded.
    }
  }

  const [dishes, items, landingReviews] = await Promise.all([featured, restaurants, reviews]);
  return (
    <>
      <HeroSection dishes={dishes} demo={demoMode} />
      <LandingReveal>
        {(demoMode || categories.length > 0) && (
          <div data-landing-reveal>
            <PopularCategories initialCategories={categories.length > 0 ? categories : undefined} />
          </div>
        )}
        {dishes.length > 0 && <div data-landing-reveal><FeaturedDishes dishes={dishes} demo={demoMode} /></div>}
        {items.length > 0 && <div data-landing-reveal><TopRestaurants restaurants={items} menuHighlights={dishes} demo={demoMode} /></div>}
        <QualityBadges reviews={landingReviews} demo={demoMode} />
      </LandingReveal>
    </>
  );
}
