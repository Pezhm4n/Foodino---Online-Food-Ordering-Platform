import Link from "next/link";
import type {
  CategorySummary,
  RestaurantSummary,
} from "@/application/ports/catalog-repository";
import { irrToToman } from "@/domain/money/money";
import FavoriteButton from "@/components/common/FavoriteButton";
import {
  DishArtwork,
  resolveFoodKind,
  FOOD_VISUAL_PALETTE,
  StarIcon,
  ClockIcon,
  CourierIcon,
  FlameIcon,
  ArrowLeftIcon,
  SparkleIcon,
} from "@/components/ui/FoodVisuals";
import styles from "./PublicCatalog.module.css";

const numberFormatter = new Intl.NumberFormat("fa-IR");

function getCuisineLabel(name: string): string {
  if (name.includes("پیتزا")) return "پیتزا ناپولیتن و ایتالیایی";
  if (name.includes("برگر")) return "برگر ذغالی و سوخاری";
  if (name.includes("سوشی")) return "سوشی و آشپزی آسیایی";
  if (
    name.includes("ایرانی") ||
    name.includes("سنتی") ||
    name.includes("کباب")
  )
    return "کباب و مطبخ اصیل ایرانی";
  if (
    name.includes("سالاد") ||
    name.includes("سبز") ||
    name.includes("سالم")
  )
    return "غذای سالم و ارگانیک";
  return "آشپزخانه منتخب فودینو";
}

export function RestaurantGrid({
  restaurants,
  favoriteIds,
}: {
  restaurants: readonly RestaurantSummary[];
  favoriteIds?: readonly string[];
}) {
  if (restaurants.length === 0) {
    return (
      <div className={styles.empty}>
        <DishArtwork kind="chef" size={88} variant="thumb" />
        <h3>رستورانی با این مشخصات یافت نشد</h3>
        <p>عبارت جست‌وجو یا فیلتر دسته‌بندی را تغییر دهید تا گزینه‌های بیشتری ببینید.</p>
        <Link href="/restaurants" className={styles.back} style={{ marginTop: "0.5rem" }}>
          <span>نمایش همه رستوران‌ها</span>
          <ArrowLeftIcon size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {restaurants.map((restaurant) => {
        const kind = resolveFoodKind(
          restaurant.slug,
          restaurant.name,
          restaurant.description
        );
        const palette = FOOD_VISUAL_PALETTE[kind];
        const cuisineLabel = getCuisineLabel(restaurant.name);
        const feeToman = irrToToman(restaurant.deliveryFee);
        const minOrderToman = irrToToman(restaurant.minimumOrder);
        const isFastDelivery = restaurant.deliveryMinutes.max <= 40;
        const isLowDelivery = feeToman <= 15000;

        return (
          <article className={styles.card} key={restaurant.id}>
            <div
              className={styles.cardCover}
              style={{
                background: `linear-gradient(135deg, ${palette.bgStart} 0%, ${palette.bgEnd} 100%)`,
              }}
            >
              <div className={styles.coverTopBar}>
                <span className={styles.openStatusBadge}>
                  <span className={styles.statusDot} />
                  <span>سفارش می‌پذیرد</span>
                </span>
                <FavoriteButton
                  restaurantId={restaurant.id}
                  restaurantName={restaurant.name}
                  initialIsFavorite={favoriteIds?.includes(restaurant.id)}
                  size="sm"
                />
              </div>

              <div
                className={styles.coverArtworkLink}
                aria-hidden="true"
              >
                <DishArtwork kind={kind} size={116} variant="thumb" />
              </div>

              <div className={styles.coverBottomBar}>
                <span
                  className={styles.cuisineBadge}
                  style={{
                    backgroundColor: palette.tagBg,
                    color: palette.tagColor,
                  }}
                >
                  <SparkleIcon size={12} />
                  <span>{cuisineLabel}</span>
                </span>

                <span className={styles.ratingBadge}>
                  <StarIcon size={13} style={{ color: "#E59A11" }} />
                  <span>{numberFormatter.format(restaurant.rating)}</span>
                </span>
              </div>
            </div>

            <Link
              className={styles.cardContent}
              href={`/restaurants/${restaurant.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.titleLink}>
                  <h2>{restaurant.name}</h2>
                </div>
              </div>

              <div className={styles.bodyLink}>
                <p>{restaurant.description}</p>
                <div className={styles.meta}>
                  <span className={styles.metaItem}>
                    <ClockIcon size={14} />
                    <span>
                      {numberFormatter.format(restaurant.deliveryMinutes.min)} تا{" "}
                      {numberFormatter.format(restaurant.deliveryMinutes.max)}{" "}
                      دقیقه
                    </span>
                  </span>
                  <span className={styles.metaItem}>
                    <CourierIcon size={14} />
                    <span>
                      پیک:{" "}
                      {feeToman === 0
                        ? "رایگان"
                        : `${numberFormatter.format(feeToman)} تومان`}
                    </span>
                  </span>
                  {isFastDelivery && (
                    <span className={styles.metaHighlight}>
                      <FlameIcon size={13} />
                      <span>ارسال سریع</span>
                    </span>
                  )}
                  {isLowDelivery && feeToman > 0 && (
                    <span className={styles.metaHighlightGreen}>
                      <span>ارسال اقتصادی</span>
                    </span>
                  )}
                  {!isFastDelivery && !(isLowDelivery && feeToman > 0) && (
                    <span className={styles.metaHighlightGreen}>
                      <span>تضمین کیفیت پخت</span>
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.minOrderHint}>
                  حداقل سفارش: {numberFormatter.format(minOrderToman)} تومان
                </span>
                <span className={styles.viewMenuBtn}>
                  <span>مشاهده منو و سفارش</span>
                  <ArrowLeftIcon size={15} />
                </span>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}

export function CategoryGrid({
  categories,
}: {
  categories: readonly CategorySummary[];
}) {
  if (categories.length === 0) {
    return (
      <div className={styles.empty}>
        <h3>دسته‌بندی فعالی وجود ندارد</h3>
      </div>
    );
  }

  return (
    <div className={styles.categoryGrid}>
      {categories.map((category) => {
        const kind = resolveFoodKind(
          category.slug,
          category.name,
          category.icon
        );
        const palette = FOOD_VISUAL_PALETTE[kind];

        return (
          <Link
            className={styles.categoryCard}
            href={`/categories/${category.slug}`}
            key={category.id}
          >
            <div
              className={styles.categoryBanner}
              style={{
                background: `linear-gradient(135deg, ${palette.bgStart} 0%, ${palette.bgEnd} 100%)`,
              }}
            >
              <span
                className={styles.categoryTag}
                style={{
                  backgroundColor: palette.tagBg,
                  color: palette.tagColor,
                }}
              >
                {palette.label}
              </span>
              <div className={styles.categoryArtWrap}>
                <DishArtwork kind={kind} size={118} variant="card" />
              </div>
            </div>

            <div className={styles.categoryBody}>
              <h2>{category.name}</h2>
              <p>{category.description}</p>
              <div className={styles.categoryFooter}>
                <span>مشاهده رستوران‌های این دسته</span>
                <ArrowLeftIcon size={15} />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export { styles as publicCatalogStyles };
