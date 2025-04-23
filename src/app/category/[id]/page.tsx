"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory, getCategoryById } from "@/lib/api";
import { Product } from "@/types";
import Loading from "@/components/ui/Loading";
import Link from "next/link";

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const category = await getCategoryById(categoryId);
        if (!category) {
          setError("دسته‌بندی مورد نظر یافت نشد");
          setLoading(false);
          return;
        }
        
        const data = await getProductsByCategory(categoryId);
        setProducts(data.products || []);
        setCategoryName(data.categoryName || "دسته‌بندی");
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("خطا در دریافت محصولات");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [categoryId]);

  if (loading) {
    return (
      <Container>
        <div className="py-20">
          <Loading size="large" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-12 text-center">
          <SectionTitle title={error} />
          <p className="mb-8 mt-4 text-gray-600">متأسفانه دسته‌بندی مورد نظر در سیستم ما موجود نیست.</p>
          <Link href="/categories" className="bg-primary-500 hover:bg-primary-600 transition-colors text-white px-6 py-2 rounded-md">
            بازگشت به دسته‌بندی‌ها
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <SectionTitle title={categoryName} />
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6 p-10">
          هیچ محصولی در این دسته‌بندی یافت نشد.
        </p>
      )}
    </Container>
  );
}