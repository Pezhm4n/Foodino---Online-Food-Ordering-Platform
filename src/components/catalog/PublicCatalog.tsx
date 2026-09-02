import Link from 'next/link';
import type { CategorySummary, RestaurantSummary } from '@/application/ports/catalog-repository';
import { irrToToman } from '@/domain/money/money';
import FavoriteButton from '@/components/common/FavoriteButton';
import styles from './PublicCatalog.module.css';

const numberFormatter = new Intl.NumberFormat('fa-IR');

function getCuisineInfo(name: string): { label: string; icon: string } {
  if (name.includes('پیتزا')) return { label: 'پیتزا و فست‌فود', icon: '🍕' };
  if (name.includes('برگر')) return { label: 'برگر و سوخاری', icon: '🍔' };
  if (name.includes('سوشی')) return { label: 'سوشی و آسیایی', icon: '🍣' };
  if (name.includes('ایرانی') || name.includes('سنتی') || name.includes('کباب')) return { label: 'غذای ایرانی', icon: '🍚' };
  if (name.includes('سالاد') || name.includes('سبز') || name.includes('سالم')) return { label: 'غذای سالم و رژیمی', icon: '🥗' };
  return { label: 'رستوران محبوب', icon: '🍽️' };
}

export function RestaurantGrid({
  restaurants,
  favoriteIds,
}: {
  restaurants: readonly RestaurantSummary[];
  favoriteIds?: readonly string[];
}) {
  if (restaurants.length === 0) return <div className={styles.empty}>رستورانی با این مشخصات یافت نشد.</div>;
  return (
    <div className={styles.grid}>
      {restaurants.map((restaurant) => {
        const cuisine = getCuisineInfo(restaurant.name);
        const feeToman = irrToToman(restaurant.deliveryFee);
        const isFastDelivery = restaurant.deliveryMinutes.max <= 35;
        const isLowDelivery = feeToman <= 15000;
        return (
          <div className={styles.card} key={restaurant.id}>
            <div className={styles.cardTopRow}>
              <span className={styles.cuisineBadge}>
                <span>{cuisine.icon}</span>
                <span>{cuisine.label}</span>
              </span>
              <span className={styles.ratingBadge}>
                <span>⭐</span>
                <span>{numberFormatter.format(restaurant.rating)}</span>
              </span>
            </div>
            <div className={styles.cardHeader}>
              <Link className={styles.titleLink} href={`/restaurants/${restaurant.slug}`}>
                <h2>{restaurant.name}</h2>
              </Link>
              <FavoriteButton
                restaurantId={restaurant.id}
                restaurantName={restaurant.name}
                initialIsFavorite={favoriteIds?.includes(restaurant.id)}
                size="sm"
              />
            </div>
            <Link className={styles.bodyLink} href={`/restaurants/${restaurant.slug}`}>
              <p>{restaurant.description}</p>
              <div className={styles.meta}>
                <span>
                  ⏱️ ارسال {numberFormatter.format(restaurant.deliveryMinutes.min)} تا{' '}
                  {numberFormatter.format(restaurant.deliveryMinutes.max)} دقیقه
                </span>
                <span>
                  🛵 هزینه ارسال {feeToman === 0 ? 'رایگان' : `${numberFormatter.format(feeToman)} تومان`}
                </span>
                {isFastDelivery && <span>⚡ تحویل سریع</span>}
                {isLowDelivery && feeToman > 0 && <span>🎁 ارسال اقتصادی</span>}
              </div>
            </Link>
            <div className={styles.cardFooter}>
              <Link className={styles.viewMenuBtn} href={`/restaurants/${restaurant.slug}`}>
                <span>مشاهده منو و سفارش</span>
                <span>←</span>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CategoryGrid({ categories }: { categories: readonly CategorySummary[] }) {
  if (categories.length === 0) return <div className={styles.empty}>دسته‌بندی فعالی وجود ندارد.</div>;
  return <div className={styles.grid}>{categories.map((category) => (
    <Link className={styles.card} href={`/categories/${category.slug}`} key={category.id}>
      <h2>{category.icon} {category.name}</h2><p>{category.description}</p>
    </Link>
  ))}</div>;
}

export { styles as publicCatalogStyles };
