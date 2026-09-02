import Link from 'next/link';
import type { CategorySummary, RestaurantSummary } from '@/application/ports/catalog-repository';
import { irrToToman } from '@/domain/money/money';
import FavoriteButton from '@/components/common/FavoriteButton';
import styles from './PublicCatalog.module.css';

const numberFormatter = new Intl.NumberFormat('fa-IR');

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
      {restaurants.map((restaurant) => (
        <div className={styles.card} key={restaurant.id}>
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
              <span>امتیاز {numberFormatter.format(restaurant.rating)}</span>
              <span>
                ارسال {numberFormatter.format(restaurant.deliveryMinutes.min)} تا{' '}
                {numberFormatter.format(restaurant.deliveryMinutes.max)} دقیقه
              </span>
              <span>هزینه ارسال {numberFormatter.format(irrToToman(restaurant.deliveryFee))} تومان</span>
            </div>
          </Link>
        </div>
      ))}
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
