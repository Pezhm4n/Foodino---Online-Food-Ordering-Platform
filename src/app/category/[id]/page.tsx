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
import styled from 'styled-components';

const LoadingRegion = styled.div`
  padding: 5rem 0;
`;

const EmptyState = styled.div`
  padding: 3rem 0;
  text-align: center;
`;

const EmptyDescription = styled.p`
  margin: 1rem 0 2rem;
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

const BackLink = styled(Link)`
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  transition: background 0.2s ease;

  &:hover { background: ${({ theme }) => theme.colors.primary[600]}; }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) { grid-template-columns: repeat(3, 1fr); }
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) { grid-template-columns: repeat(4, 1fr); }
`;

const NoProducts = styled.p`
  margin-top: 1.5rem;
  padding: 2.5rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

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
        <LoadingRegion>
          <Loading size="large" />
        </LoadingRegion>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <EmptyState>
          <SectionTitle title={error} />
          <EmptyDescription>متأسفانه دسته‌بندی مورد نظر در سیستم ما موجود نیست.</EmptyDescription>
          <BackLink href="/categories">
            بازگشت به دسته‌بندی‌ها
          </BackLink>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <SectionTitle title={categoryName} />
      {products.length > 0 ? (
        <ProductsGrid>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductsGrid>
      ) : (
        <NoProducts>
          هیچ محصولی در این دسته‌بندی یافت نشد.
        </NoProducts>
      )}
    </Container>
  );
}
