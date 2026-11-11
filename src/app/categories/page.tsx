import type { Metadata } from "next";
import {
  CategoryGrid,
  publicCatalogStyles as styles,
} from "@/components/catalog/PublicCatalog";
import { SparkleIcon } from "@/components/ui/FoodVisuals";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server";
import { SupabaseCatalogRepository } from "@/infrastructure/supabase/repositories/supabase-catalog-repository";

export const metadata: Metadata = {
  title: "دسته‌بندی غذا | فودینو",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const repository = new SupabaseCatalogRepository(
    await createSupabaseServerClient()
  );
  const categories = await repository.listCategories();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>
          <SparkleIcon size={13} />
          <span>انتخاب غذا</span>
        </span>
        <h1>دسته‌بندی‌های غذایی</h1>
        <p>
          نوع غذا را انتخاب کنید تا رستوران‌های آن را ببینید.
        </p>
      </header>
      <CategoryGrid categories={categories} />
    </div>
  );
}
